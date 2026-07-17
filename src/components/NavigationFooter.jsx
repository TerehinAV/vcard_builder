import React from 'react';
import { useTranslation } from 'react-i18next';

const NavigationFooter = ({ onBack, onNext, nextDisabled = false, nextLabel, isSubmit = false }) => {
  const { t } = useTranslation();
  const resolvedNextLabel = nextLabel ?? t('nav.next');

  return (
    <div className="flex flex-row justify-between items-center gap-3 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={onBack}
        className="btn-secondary flex items-center justify-center !px-4 sm:!px-6"
        aria-label={t('nav.back')}
      >
        <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">{t('nav.back')}</span>
      </button>

      <button
        type={isSubmit ? "submit" : "button"}
        onClick={isSubmit ? undefined : onNext}
        disabled={nextDisabled}
        className="btn-primary flex-1 sm:flex-initial flex items-center justify-center"
        aria-label={resolvedNextLabel}
      >
        {resolvedNextLabel}
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationFooter;
