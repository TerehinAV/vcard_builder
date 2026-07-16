import React from 'react';
import NavigationHeader from './NavigationHeader';

const versions = [
  {
    id: "2.1",
    title: "vCard 2.1",
    subtitle: "Простая совместимая визитка для оффлайн-бирки и старых устройств",
    fields: [
      { name: "name", label: "Имя", required: true },
      { name: "phone", label: "Телефон", required: false },
      { name: "email", label: "Email", required: false },
      { name: "org", label: "Компания/Организация", required: false },
      { name: "note", label: "Примечание", required: false },
    ],
  },
  {
    id: "3.0",
    title: "vCard 3.0",
    subtitle: "Рекомендуемый формат для Android, iOS и email-клиентов",
    fields: [
      { name: "name", label: "Имя", required: true },
      { name: "phone", label: "Телефон", required: false },
      { name: "email", label: "Email", required: false },
      { name: "org", label: "Компания/Организация", required: false },
      { name: "note", label: "Примечание", required: false },
    ],
  },
  {
    id: "4.0",
    title: "vCard 4.0",
    subtitle: "Поддержка соцсетей, GPS и современных полей",
    fields: [
      { name: "name", label: "Имя", required: true },
      { name: "phone", label: "Телефон", required: false },
      { name: "email", label: "Email", required: false },
      { name: "org", label: "Компания/Организация", required: false },
      { name: "note", label: "Примечание", required: false },
      { name: "social", label: "Соцсети (URL через запятую)", required: false },
      { name: "geo", label: "GPS (широта,долгота через запятую)", required: false },
      { name: "impp", label: "Мессенджеры (через запятую)", required: false },
    ],
  },
];

const VersionSelector = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <NavigationHeader
        currentStep={1}
        totalSteps={4}
        title="Выберите версию vCard"
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
            aria-label={`Выбрать версию ${version.title}`}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {version.id}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {version.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {version.subtitle}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {version.fields.slice(0, 3).map((field) => (
                  <span
                    key={field.name}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {field.label}
                  </span>
                ))}
                {version.fields.length > 3 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-xs font-medium">
                    +{version.fields.length - 3} больше
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
          aria-label="Назад"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
};

export { versions };
export default VersionSelector;