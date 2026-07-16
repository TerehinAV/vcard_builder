import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { versions } from './VersionSelector';
import NavigationHeader from './NavigationHeader';
import NavigationFooter from './NavigationFooter';

const isValidEmail = (email) =>
  email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  phone.length === 0 || /^[\d+\-\s()]+$/.test(phone);

const QRForm = ({ version, onBack, onFinish }) => {
  const { t } = useTranslation();
  const verData = versions.find((v) => v.id === version);

  const initialForm = {};
  verData.fields.forEach(({ name }) => {
    initialForm[name] = "";
  });

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((tPrev) => ({ ...tPrev, [field]: true }));
  };

  const generateVCard = () => {
    let lines = ["BEGIN:VCARD", `VERSION:${version}`];

    if (version === "2.1" || version === "3.0") {
      if (form.name) lines.push(`N:${form.name}`);
      if (form.phone) lines.push(`TEL:${form.phone}`);
      if (form.email) lines.push(`EMAIL:${form.email}`);
      if (form.org) lines.push(`ORG:${form.org}`);
      if (form.note) lines.push(`NOTE:${form.note}`);
    } else if (version === "4.0") {
      if (form.name) lines.push(`FN:${form.name}`);
      if (form.phone) lines.push(`TEL;TYPE=cell:${form.phone}`);
      if (form.email) lines.push(`EMAIL:${form.email}`);
      if (form.org) lines.push(`ORG:${form.org}`);
      if (form.note) lines.push(`NOTE:${form.note}`);

      if (form.social) {
        const urls = form.social.split(",").map(u => u.trim()).filter(Boolean);
        urls.forEach((url) => lines.push(`SOCIALPROFILE:${url}`));
      }

      if (form.geo) {
        const parts = form.geo.split(",").map(p => p.trim());
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          lines.push(`GEO:geo:${parts[0]},${parts[1]}`);
        }
      }

      if (form.impp) {
        const impps = form.impp.split(",").map(i => i.trim()).filter(Boolean);
        impps.forEach((im) => lines.push(`IMPP:${im}`));
      }
    }

    lines.push("END:VCARD");
    return lines.join("\n");
  };

  const nameValid = form.name.trim().length > 0;
  const emailValid = isValidEmail(form.email);
  const phoneValid = isValidPhone(form.phone);
  const formValid = nameValid && emailValid && phoneValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) {
      const qrValue = generateVCard();
      onFinish(form, qrValue);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <NavigationHeader
        currentStep={2}
        totalSteps={4}
        title={t('form.heading', { version: verData.title })}
      />

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verData.fields.map(({ name, labelKey, required }, index) => {
              const label = t(labelKey);
              return (
                <div
                  key={name}
                  className="animate-slideInRight"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <label htmlFor={name} className="block font-semibold mb-3 text-gray-800 dark:text-gray-100">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    id={name}
                    name={name}
                    type="text"
                    value={form[name]}
                    onChange={(e) => handleChange(name, e.target.value)}
                    onBlur={() => handleBlur(name)}
                    className={`input-field ${
                      touched[name] && required && form[name].trim().length === 0
                        ? 'error'
                        : touched[name] && (name === "email" && !emailValid)
                        ? 'error'
                        : touched[name] && (name === "phone" && !phoneValid)
                        ? 'error'
                        : ''
                    }`}
                    placeholder={required ? t('form.placeholderRequired', { label }) : t('form.placeholder', { label })}
                    aria-invalid={
                      touched[name] && required && form[name].trim().length === 0
                        ? "true"
                        : touched[name] && (name === "email" && !emailValid)
                        ? "true"
                        : touched[name] && (name === "phone" && !phoneValid)
                        ? "true"
                        : "false"
                    }
                  />

                  {touched[name] && required && form[name].trim().length === 0 && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {t('form.errRequired', { label })}
                    </p>
                  )}
                  {touched[name] && name === "email" && !emailValid && form[name].length > 0 && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {t('form.errEmail')}
                    </p>
                  )}
                  {touched[name] && name === "phone" && !phoneValid && form[name].length > 0 && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {t('form.errPhone')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <NavigationFooter
            onBack={onBack}
            onNext={handleSubmit}
            nextDisabled={!formValid}
            nextLabel={t('form.submit')}
            isSubmit={true}
          />
        </form>
      </div>
    </div>
  );
};

export default QRForm;
