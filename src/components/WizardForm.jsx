import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import VersionSelector from './VersionSelector';
import QRForm from './QRForm';
import FinalStep from './FinalStep';

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
        return <FinalStep qrValue={finalQRValue} onRestart={handleRestart} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto max-w-6xl">
        {renderStep()}
      </div>
    </div>
  );
};

export default WizardForm;