import React from 'react';
import { useTranslation } from 'react-i18next';

const NavigationHeader = ({ currentStep, totalSteps, title }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8 animate-fadeInUp">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`progress-dot ${
                i < currentStep ? 'completed' :
                i === currentStep ? 'active' :
                'inactive'
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold title-gradient mb-2">
        {title}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 font-medium">
        {t('nav.stepProgress', { current: currentStep + 1, total: totalSteps })}
      </p>
    </div>
  );
};

export default NavigationHeader;
