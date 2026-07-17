import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { copyQRCodeAsImage, downloadQRCodeAsImage } from '../utils/qrUtils';

const FinalStep = ({ qrValue, onRestart }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyImage = async () => {
    setIsLoading(true);
    try {
      await copyQRCodeAsImage('qr-container', qrValue);
      alert(t('result.alertCopiedImage'));
    } catch (error) {
      console.error('Copy error:', error);
      try {
        await navigator.clipboard.writeText(qrValue);
        alert(t('result.alertCopiedText'));
      } catch (textError) {
        alert(t('result.alertCopyFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadQRCodeAsImage(qrValue, 'qr-vcard.png');
      alert(t('result.alertDownloaded'));
    } catch (error) {
      console.error('Download error:', error);
      alert(t('result.alertDownloadFailed'));
    }
  };

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
            <div
              key={i}
              className="progress-dot completed"
            />
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
              id="qr-container"
              className={`qr-container mb-6 ${isLoading ? 'opacity-50' : ''}`}
              title={t('result.qrTooltip')}
              onClick={handleCopyImage}
              style={{ cursor: isLoading ? 'wait' : 'pointer' }}
            >
              <QRCodeSVG value={qrValue} size={280} />
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('result.qrHelper')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
          <button
            onClick={handleCopyImage}
            disabled={isLoading}
            className="btn-success flex items-center justify-center"
            aria-label={t('result.copyImageFull')}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('result.copying')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {t('result.copyImage')}
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="btn-icon flex items-center justify-center"
            aria-label={t('result.downloadImage')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            {t('result.downloadPng')}
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

export default FinalStep;
