import React from 'react';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto animate-fadeInUp">
      {/* Progress indicator */}
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
      
      {/* Main content card */}
      <div className="card">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold title-gradient leading-tight">
              Создайте свою QR-визитку
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Современное приложение для создания <span className="text-gradient font-semibold">персональных QR-кодов</span> с контактной информацией
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="card-compact text-left">
              <h3 className="font-semibold text-gray-800 mb-2">🎯 Универсальность</h3>
              <p className="text-gray-600 text-sm">Багажные бирки, визитки, наклейки для техники</p>
            </div>
            <div className="card-compact text-left">
              <h3 className="font-semibold text-gray-800 mb-2">📱 Совместимость</h3>
              <p className="text-gray-600 text-sm">Работает с любыми устройствами и сканерами</p>
            </div>
            <div className="card-compact text-left">
              <h3 className="font-semibold text-gray-800 mb-2">🔒 Безопасность</h3>
              <p className="text-gray-600 text-sm">Данные обрабатываются только на вашем устройстве</p>
            </div>
            <div className="card-compact text-left">
              <h3 className="font-semibold text-gray-800 mb-2">⚡ Быстрота</h3>
              <p className="text-gray-600 text-sm">Создание QR-кода за несколько секунд</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action button */}
      <div className="pt-4">
        <button
          onClick={onNext}
          className="btn-primary text-lg px-8 py-4 animate-pulse-gentle"
          aria-label="Начать создание"
        >
          Начать создание
          <span className="text-xl ml-2">✨</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;