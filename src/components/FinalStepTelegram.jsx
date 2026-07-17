import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRDataURL } from '../utils/qrUtils';

const FinalStepTelegram = ({ qrValue, onRestart }) => {
  const { t } = useTranslation();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveImageUrl, setSaveImageUrl] = useState(null);

  const openSaveModal = useCallback(async () => {
    if (!saveImageUrl) {
      const url = await generateQRDataURL(qrValue, 600);
      setSaveImageUrl(url);
    }
    setSaveModalOpen(true);
  }, [qrValue, saveImageUrl]);

  const closeSaveModal = useCallback(() => {
    setSaveModalOpen(false);
  }, []);

  useEffect(() => {
    if (!saveModalOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeSaveModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [saveModalOpen, closeSaveModal]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      alert(t('result.alertVCopied'));
    } catch (error) {
      alert(t('result.alertVCopyFailed'));
    }
  };

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
              title={t('result.saveQrTitle')}
              onClick={openSaveModal}
              style={{ cursor: 'pointer' }}
            >
              <QRCodeSVG value={qrValue} size={280} />
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {t('result.saveQrHintMobile')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={openSaveModal}
            className="btn-success flex items-center justify-center"
            aria-label={t('result.saveImage')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('result.saveImage')}
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

      {saveModalOpen && (
        <div
          className="modal-backdrop"
          onClick={closeSaveModal}
          role="dialog"
          aria-modal="true"
          aria-label={t('result.saveQrTitle')}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeSaveModal}
              className="modal-close"
              aria-label={t('result.close')}
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
              {t('result.saveQrTitle')}
            </h3>
            {saveImageUrl && (
              <img
                src={saveImageUrl}
                alt="QR vCard"
                className="modal-qr-image"
              />
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {t('result.saveQrHintMobile')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('result.saveQrHintDesktop')}
            </p>
            <button
              type="button"
              onClick={closeSaveModal}
              className="btn-primary w-full"
            >
              {t('result.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStepTelegram;
