import React from 'react';
import { useTranslation } from 'react-i18next';

const NavigationFooter = ({ onBack, onNext, nextDisabled = false, nextLabel, isSubmit = false }) => {
  const { t } = useTranslation();
  const resolvedNextLabel = nextLabel ?? t('nav.next');

  return (
    <div className="flex flex-col gap-3 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:justify-between sm:gap-4">
      <button
        type="button"
        onClick={onBack}
        className="btn-secondary w-full sm:w-auto flex items-center justify-center"
        aria-label={t('nav.back')}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('nav.back')}
      </button>

      <button
        type={isSubmit ? "submit" : "button"}
        onClick={isSubmit ? undefined : onNext}
        disabled={nextDisabled}
        className="btn-primary w-full sm:w-auto flex items-center justify-center"
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
