import React from 'react';

const NavigationFooter = ({ onBack, onNext, nextDisabled = false, nextLabel = "Далее", isSubmit = false }) => {
  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        type="button"
        onClick={onBack}
        className="btn-secondary flex items-center"
        aria-label="Назад"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>

      <button
        type={isSubmit ? "submit" : "button"}
        onClick={isSubmit ? undefined : onNext}
        disabled={nextDisabled}
        className="btn-primary flex items-center"
        aria-label={nextLabel}
      >
        {nextLabel}
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationFooter;