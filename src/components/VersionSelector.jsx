import React from 'react';
import { useTranslation } from 'react-i18next';
import NavigationHeader from './NavigationHeader';

const versions = [
  {
    id: "2.1",
    title: "vCard 2.1",
    subtitleKey: 'versions.v21Subtitle',
    fields: [
      { name: "name", labelKey: "versions.fields.name", required: true },
      { name: "phone", labelKey: "versions.fields.phone", required: false },
      { name: "email", labelKey: "versions.fields.email", required: false },
      { name: "org", labelKey: "versions.fields.org", required: false },
      { name: "note", labelKey: "versions.fields.note", required: false },
    ],
  },
  {
    id: "3.0",
    title: "vCard 3.0",
    subtitleKey: 'versions.v30Subtitle',
    fields: [
      { name: "name", labelKey: "versions.fields.name", required: true },
      { name: "phone", labelKey: "versions.fields.phone", required: false },
      { name: "email", labelKey: "versions.fields.email", required: false },
      { name: "org", labelKey: "versions.fields.org", required: false },
      { name: "note", labelKey: "versions.fields.note", required: false },
    ],
  },
  {
    id: "4.0",
    title: "vCard 4.0",
    subtitleKey: 'versions.v40Subtitle',
    fields: [
      { name: "name", labelKey: "versions.fields.name", required: true },
      { name: "phone", labelKey: "versions.fields.phone", required: false },
      { name: "email", labelKey: "versions.fields.email", required: false },
      { name: "org", labelKey: "versions.fields.org", required: false },
      { name: "note", labelKey: "versions.fields.note", required: false },
      { name: "social", labelKey: "versions.fields.social", required: false },
      { name: "geo", labelKey: "versions.fields.geo", required: false },
      { name: "impp", labelKey: "versions.fields.impp", required: false },
    ],
  },
];

const VersionSelector = ({ onSelect, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <NavigationHeader
        currentStep={1}
        totalSteps={4}
        title={t('versions.screenTitle')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {versions.map((version, index) => (
          <div
            key={version.id}
            onClick={() => onSelect(version.id)}
            className="selection-card animate-slideInRight"
            style={{ animationDelay: `${index * 0.1}s` }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") onSelect(version.id); }}
            aria-label={t('versions.selectVersion', { version: version.title })}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {version.id}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {version.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {t(version.subtitleKey)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {version.fields.slice(0, 3).map((field) => (
                  <span
                    key={field.name}
                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
                  >
                    {t(field.labelKey)}
                  </span>
                ))}
                {version.fields.length > 3 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-xs font-medium">
                    {t('versions.moreFields', { count: version.fields.length - 3 })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onBack}
          className="btn-secondary"
          aria-label={t('nav.back')}
        >
          {t('nav.backArrow')}
        </button>
      </div>
    </div>
  );
};

export { versions };
export default VersionSelector;
