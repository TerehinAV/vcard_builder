import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRDataURL } from '../utils/qrUtils';
import { useTelegram } from '../hooks/useTelegram';

const WORKER_URL = import.meta.env.VITE_WORKER_URL || '';

const FinalStepTelegram = ({ qrValue, onRestart }) => {
  const { t } = useTranslation();
  const telegram = useTelegram();
  const [isSending, setIsSending] = useState(false);

  const sendToChat = useCallback(async () => {
    if (!WORKER_URL) {
      alert(t('result.alertNoWorker'));
      return;
    }
    if (!telegram.initData) {
      alert(t('result.alertBotNotStarted'));
      return;
    }

    setIsSending(true);
    try {
      const dataUrl = await generateQRDataURL(qrValue, 600);
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: telegram.initData, image: dataUrl }),
      });
      const data = await response.json().catch(() => ({}));

      if (data.ok) {
        telegram.close();
        return;
      }

      if (data.error === 'bot_not_started') {
        alert(t('result.alertBotNotStarted'));
      } else {
        alert(t('result.alertSendFailed'));
      }
    } catch (error) {
      console.error('Send error:', error);
      alert(t('result.alertSendFailed'));
    } finally {
      setIsSending(false);
    }
  }, [qrValue, telegram, t]);

  const openInViewer = useCallback(async () => {
    setIsSending(true);
    try {
      const dataUrl = await generateQRDataURL(qrValue, 600);
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      const viewerUrl = new URL('viewer.html', window.location.href).href;
      const fullUrl = `${viewerUrl}#${base64}`;

      const webApp = window.Telegram?.WebApp;
      if (webApp?.openLink) {
        webApp.openLink(fullUrl);
      } else {
        window.open(fullUrl, '_blank');
      }
    } catch (error) {
      console.error('Viewer error:', error);
      alert(t('result.alertSendFailed'));
    } finally {
      setIsSending(false);
    }
  }, [qrValue, t]);

  const handleSaveImage = useCallback(async () => {
    if (WORKER_URL) {
      await sendToChat();
    } else {
      await openInViewer();
    }
  }, [sendToChat, openInViewer]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      alert(t('result.alertVCopied'));
    } catch (error) {
      alert(t('result.alertVCopyFailed'));
    }
  };

  const primaryLabel = WORKER_URL
    ? (isSending ? t('result.sending') : t('result.sendToChat'))
    : t('result.openImage');
  const primaryAria = WORKER_URL ? t('result.sendToChat') : t('result.openImage');
  const primaryHint = WORKER_URL
    ? (isSending ? t('result.sending') : t('result.qrHelper'))
    : t('result.openImageHint');

  return (
    <div className="max-w-2xl mx-auto text-center animate-fadeInUp">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="progress-dot completed" />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold title-gradient mb-4">
            {t('result.heading')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            {t('result.description')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('nav.stepFinal')}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="card">
            <div
              className="qr-container mb-6"
              title={primaryAria}
              onClick={handleSaveImage}
              style={{ cursor: isSending ? 'wait' : 'pointer' }}
            >
              <QRCodeSVG value={qrValue} size={280} />
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {primaryHint}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={handleSaveImage}
            disabled={isSending}
            className="btn-success flex items-center justify-center"
            aria-label={primaryAria}
          >
            {isSending ? (
              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {primaryLabel}
          </button>

          <button
            onClick={handleCopyText}
            className="btn-secondary flex items-center justify-center"
            aria-label={t('result.copyTextFull')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('result.copyText')}
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onRestart}
            className="btn-primary px-8 py-3"
            aria-label={t('result.restart')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {t('result.restart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalStepTelegram;
