import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import VersionSelector from './VersionSelector';
import QRForm from './QRForm';
import FinalStep from './FinalStep';
import FinalStepTelegram from './FinalStepTelegram';
import { isTelegramWebApp } from '../utils/qrUtils';

const WizardForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [finalQRValue, setFinalQRValue] = useState(null);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setCurrentStep(2);
  };

  const handleFormFinish = (formData, qrValue) => {
    setFinalQRValue(qrValue);
    setCurrentStep(3);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedVersion(null);
    setFinalQRValue(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <VersionSelector onSelect={handleVersionSelect} onBack={handleBack} />;
      case 2:
        return (
          <QRForm
            version={selectedVersion}
            onBack={handleBack}
            onFinish={handleFormFinish}
          />
        );
      case 3:
        return isTelegramWebApp() ? (
          <FinalStepTelegram qrValue={finalQRValue} onRestart={handleRestart} />
        ) : (
          <FinalStep qrValue={finalQRValue} onRestart={handleRestart} />
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-background)',
        paddingTop: 'calc(2rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
        paddingRight: 'calc(1rem + env(safe-area-inset-right))',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {renderStep()}
      </div>
    </div>
  );
};

export default WizardForm;