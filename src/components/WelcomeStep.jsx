import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeStep = ({ onNext }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto animate-fadeInUp">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`progress-dot ${
                i === 0 ? 'active' : 'inactive'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold title-gradient leading-tight">
              {t('welcome.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {t('welcome.subtitle')} <span className="text-gradient font-semibold">{t('welcome.subtitleHighlight')}</span> {t('welcome.subtitleEnd')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="feature-tile text-left">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('welcome.featureUniversalityTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t('welcome.featureUniversalityDesc')}</p>
            </div>
            <div className="feature-tile text-left">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('welcome.featureCompatibilityTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t('welcome.featureCompatibilityDesc')}</p>
            </div>
            <div className="feature-tile text-left">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('welcome.featureSecurityTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t('welcome.featureSecurityDesc')}</p>
            </div>
            <div className="feature-tile text-left">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('welcome.featureSpeedTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t('welcome.featureSpeedDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          className="btn-primary text-lg px-8 py-4 animate-pulse-gentle"
          aria-label={t('welcome.startButton')}
        >
          {t('welcome.startButton')}
          <span className="text-xl ml-2">✨</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;
