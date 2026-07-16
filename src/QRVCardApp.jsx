import React from 'react';
import WizardForm from './components/WizardForm';
import { useTheme } from './hooks/useTheme';

function QRVCardApp() {
  useTheme();
  return <WizardForm />;
}

export default QRVCardApp;
