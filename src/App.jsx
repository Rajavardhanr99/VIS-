import React, { useState, useEffect, useCallback } from 'react';

// --- Mock Lucide Icons (stroke will inherit from text color) ---
const WeightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 16a4 4 0 100-8 4 4 0 000 8z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m15.5 15.5-.707.707"/><path d="m8.5 8.5-.707.707"/><path d="m15.5 8.5.707.707"/><path d="m8.5 15.5.707.707"/></svg>;
const SyringeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3a2.43 2.43 0 0 1-3.4 0l-.6-.6a2.43 2.43 0 0 1 0-3.4Z"/><path d="m18 8-1.4-1.4"/><path d="M2 22l5.5-5.5"/><path d="m7 18.5 2.5-2.5"/><path d="m13.5 12 2.5-2.5"/></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><line x1="16" x2="12" y1="14" y2="14"/><line x1="12" x2="12" y1="14" y2="18"/><line x1="12" x2="8" y1="14" y2="14"/><line x1="8" x2="8" y1="14" y2="18"/><line x1="8" x2="16" y1="10" y2="10"/></svg>;
const HeartPulseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


// --- Drug Definitions (All dilutions in 50mL) ---
const drugDefinitions = {
  norepinephrine: {
    name: 'Norepinephrine (Levophed)',
    strengths: {
      single: { label: 'Single (4mg/50ml)', concentration: 80 }, 
      double: { label: 'Double (8mg/50ml)', concentration: 160 },
    },
    visMultiplier: 100,
    unit: 'mcg/kg/min',
    sliderMaxRate: 20, 
    doseDecimalPlaces: 3,
    targetDoseStep: 0.001,
    defaultMaxDoseFallback: 0.5, 
  },
  epinephrine: {
    name: 'Epinephrine (Adrenaline)',
    strengths: {
      single: { label: 'Single (1mg/50ml)', concentration: 20 }, 
      double: { label: 'Double (2mg/50ml)', concentration: 40 }, 
    },
    visMultiplier: 100,
    unit: 'mcg/kg/min',
    sliderMaxRate: 15, 
    doseDecimalPlaces: 3,
    targetDoseStep: 0.001,
    defaultMaxDoseFallback: 0.5, 
  },
  dopamine: {
    name: 'Dopamine',
    strengths: {
      single: { label: 'Single (200mg/50ml)', concentration: 4000 }, 
      double: { label: 'Double (400mg/50ml)', concentration: 8000 }, 
    },
    visMultiplier: 1,
    unit: 'mcg/kg/min',
    sliderMaxRate: 20, 
    doseDecimalPlaces: 2,
    targetDoseStep: 0.1,
    defaultMaxDoseFallback: 50, 
  },
  dobutamine: {
    name: 'Dobutamine',
    strengths: {
      single: { label: 'Single (125mg/50ml)', concentration: 2500 }, 
      double: { label: 'Double (250mg/50ml)', concentration: 5000 }, 
    },
    visMultiplier: 1,
    unit: 'mcg/kg/min',
    sliderMaxRate: 20, 
    doseDecimalPlaces: 2,
    targetDoseStep: 0.1,
    defaultMaxDoseFallback: 40, 
  },
  milrinone: {
    name: 'Milrinone',
    strengths: {
      single: { label: 'Standard (10mg/50ml)', concentration: 200 }, 
      double: { label: 'Concentrated (20mg/50ml)', concentration: 400 }, 
    },
    visMultiplier: 10,
    unit: 'mcg/kg/min',
    sliderMaxRate: 10, 
    doseDecimalPlaces: 3,
    targetDoseStep: 0.001,
    defaultMaxDoseFallback: 1, 
  },
  vasopressin: {
    name: 'Vasopressin',
    strengths: {
      single: { label: 'Standard (20U/50ml)', concentration: 0.4 }, 
      double: { label: 'Concentrated (40U/50ml)', concentration: 0.8 }, 
    },
    visMultiplier: 10000,
    unit: 'units/kg/min',
    sliderMaxRate: 10, 
    doseDecimalPlaces: 5,
    targetDoseStep: 0.00001,
    defaultMaxDoseFallback: 0.002, 
  },
};

const drugKeys = Object.keys(drugDefinitions);

const initialDrugSettings = Object.fromEntries(
  drugKeys.map(key => [
    key,
    {
      rate: 0, // mL/hr
      strengthKey: 'single',
      dose: 0, // Calculated dose in drugDefinitions[key].unit
      visContribution: 0,
    },
  ])
);

function App() {
  const [patientWeight, setPatientWeight] = useState(70); // kg
  const [drugSettings, setDrugSettings] = useState(initialDrugSettings);
  const [totalVisScore, setTotalVisScore] = useState(0);
  const [isVisModalOpen, setIsVisModalOpen] = useState(false); // State for VIS modal

  const calculateDoseFromRate = useCallback((drugId, rate, strengthKey, currentWeight) => {
    if (currentWeight <= 0) return { dose: 0, visContribution: 0 };
    
    const drugDef = drugDefinitions[drugId];
    const concentration = drugDef.strengths[strengthKey]?.concentration;

    if (!drugDef || typeof concentration === 'undefined') {
        console.error(`calculateDoseFromRate: Invalid drugId, strengthKey, or missing concentration: ${drugId}, ${strengthKey}`);
        return { dose: 0, visContribution: 0 };
    }
    
    const calculatedDose = (rate * concentration) / (currentWeight * 60);
    const visContribution = calculatedDose * drugDef.visMultiplier;

    return {
      dose: isNaN(calculatedDose) ? 0 : Math.max(0, calculatedDose),
      visContribution: isNaN(visContribution) ? 0 : Math.max(0, visContribution),
    };
  }, []);

  const calculateRateFromDose = useCallback((drugId, targetDose, strengthKey, currentWeight) => {
    if (currentWeight <= 0 || targetDose < 0) return 0;
    if (targetDose === 0) return 0;

    const drugDef = drugDefinitions[drugId];
    const concentration = drugDef.strengths[strengthKey]?.concentration;

    if (!drugDef || typeof concentration === 'undefined' || concentration === 0) {
      console.error(`calculateRateFromDose: Invalid drugId, strengthKey, or zero/missing concentration: ${drugId}, ${strengthKey}`);
      return 0;
    }

    const calculatedRate = (targetDose * currentWeight * 60) / concentration;
    return isNaN(calculatedRate) ? 0 : Math.max(0, calculatedRate);
  }, []);

  const handleRateOrStrengthChange = useCallback((drugId, type, value) => {
    setDrugSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const drugSetting = { ...newSettings[drugId] };

      if (type === 'rate') {
        drugSetting.rate = Math.max(0, parseFloat(value) || 0);
      } else if (type === 'strength') {
        drugSetting.strengthKey = value;
      }

      const { dose, visContribution } = calculateDoseFromRate(
        drugId,
        drugSetting.rate, 
        drugSetting.strengthKey, 
        patientWeight
      );
      drugSetting.dose = dose;
      drugSetting.visContribution = visContribution;
      newSettings[drugId] = drugSetting;
      return newSettings;
    });
  }, [patientWeight, calculateDoseFromRate]);

  const handleTargetDoseChange = useCallback((drugId, targetDoseString) => {
    const targetDoseValue = parseFloat(targetDoseString);

    if (isNaN(targetDoseValue) || targetDoseValue < 0) {
        if (targetDoseString === "" && drugSettings[drugId].dose !== 0) {
            handleRateOrStrengthChange(drugId, 'rate', '0'); 
        }
        return; 
    }
    
    const currentStrengthKey = drugSettings[drugId].strengthKey;
    const newRate = calculateRateFromDose(drugId, targetDoseValue, currentStrengthKey, patientWeight);
    handleRateOrStrengthChange(drugId, 'rate', newRate.toString());

  }, [patientWeight, drugSettings, calculateRateFromDose, handleRateOrStrengthChange]);


  useEffect(() => {
    const newTotalVis = Object.values(drugSettings).reduce(
      (sum, setting) => sum + (setting.visContribution || 0),
      0
    );
    setTotalVisScore(newTotalVis);
  }, [drugSettings]);

  const handleWeightChange = (e) => {
    const newWeight = parseFloat(e.target.value);
    setPatientWeight(newWeight > 0 ? newWeight : 0);
  };
  
  useEffect(() => {
    setDrugSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        for (const drugId in newSettings) {
            const drugSetting = { ...newSettings[drugId] };
            const { dose, visContribution } = calculateDoseFromRate(
                drugId,
                drugSetting.rate, 
                drugSetting.strengthKey, 
                patientWeight 
            );
            drugSetting.dose = dose;
            drugSetting.visContribution = visContribution;
            newSettings[drugId] = drugSetting;
        }
        return newSettings;
    });
  }, [patientWeight, calculateDoseFromRate]); 


  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl pb-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 flex items-center justify-center space-x-3">
            <CalculatorIcon />
            <span>ICU Vasoactive Drug & VIS Calculator</span>
          </h1>
          <p className="text-gray-600 mt-2">All dilutions in 50mL. Calculate dosages (mL/hr ↔ {drugDefinitions.norepinephrine.unit}) and Vasoactive-Inotropic Score (VIS).</p>
        </header>

        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <label htmlFor="patientWeight" className="block text-lg font-medium text-blue-600 mb-2 flex items-center space-x-2">
            <WeightIcon />
            <span>Patient Weight (kg)</span>
          </label>
          <input
            type="number"
            id="patientWeight"
            value={patientWeight === 0 && document.activeElement !== document.getElementById('patientWeight') ? "" : patientWeight}
            onChange={handleWeightChange}
            min="0"
            step="0.1"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
            placeholder="Enter weight in kg"
          />
           {patientWeight <=0 && <p className="text-red-500 text-sm mt-2 flex items-center"><InfoIcon className="mr-1 w-4 h-4"/> Dose calculations require a patient weight greater than 0.</p>}
        </div>

        {/* VIS Score Display and Modal Button */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-3">
                <span className="text-lg text-gray-700">Current Vasoactive-Inotropic Score (VIS): </span>
                <span className={`text-2xl font-bold ${patientWeight <= 0 ? 'text-gray-400' : 'text-green-600'}`}>
                    {totalVisScore.toFixed(patientWeight <= 0 ? 0 : 1)}
                </span>
            </div>
            <button
                onClick={() => setIsVisModalOpen(true)}
                disabled={patientWeight <= 0}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <HeartPulseIcon className="mr-2 h-5 w-5"/>
                View VIS Details & Formula
            </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {drugKeys.map((drugId) => {
            const drugDef = drugDefinitions[drugId];
            const settings = drugSettings[drugId];
            if (!drugDef || !settings) return null;

            const isDisabled = patientWeight <= 0;
            const concentration = drugDef.strengths[settings.strengthKey]?.concentration;

            let dynamicSliderMaxDose;
            if (isDisabled || typeof concentration === 'undefined' || concentration <= 0 || patientWeight <= 0) {
                dynamicSliderMaxDose = drugDef.defaultMaxDoseFallback;
            } else {
                const calculatedMaxDose = (drugDef.sliderMaxRate * concentration) / (patientWeight * 60);
                 dynamicSliderMaxDose = Math.max(calculatedMaxDose, drugDef.targetDoseStep * 10); 
                if (calculatedMaxDose <= 0 && drugDef.sliderMaxRate > 0) {
                     dynamicSliderMaxDose = drugDef.defaultMaxDoseFallback; 
                }
            }
            
            const doseInputMax = Math.max(dynamicSliderMaxDose * 1.5, drugDef.defaultMaxDoseFallback * 2);


            return (
              <div key={drugId} className={`bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4 ${isDisabled ? 'opacity-60' : ''}`}>
                <h2 className="text-xl font-semibold text-blue-600 flex items-center space-x-2">
                  <SyringeIcon />
                  <span>{drugDef.name}</span>
                </h2>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Strength (in 50mL)</span>
                  <div className="flex space-x-2">
                    {Object.keys(drugDef.strengths).map((strengthKey) => (
                      <button
                        key={strengthKey}
                        onClick={() => handleRateOrStrengthChange(drugId, 'strength', strengthKey)}
                        disabled={isDisabled}
                        className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors
                          ${settings.strengthKey === strengthKey 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                          ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {drugDef.strengths[strengthKey].label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor={`${drugId}-rate-input`} className="block text-sm font-medium text-gray-700">
                    Rate (mL/hr): {settings.rate.toFixed(1)}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      id={`${drugId}-rate-slider`}
                      min="0"
                      max={drugDef.sliderMaxRate}
                      step="0.1"
                      value={settings.rate}
                      onChange={(e) => handleRateOrStrengthChange(drugId, 'rate', e.target.value)}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isDisabled}
                    />
                     <input
                      type="number"
                      id={`${drugId}-rate-input`}
                      value={settings.rate === 0 && document.activeElement !== document.getElementById(`${drugId}-rate-input`) ? "" : settings.rate.toFixed(1)}
                      onChange={(e) => handleRateOrStrengthChange(drugId, 'rate', e.target.value || '0')}
                      min="0"
                      max={drugDef.sliderMaxRate * 1.5} 
                      step="0.1"
                      className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="mL/hr"
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={`${drugId}-target-dose-input`} className="block text-sm font-medium text-gray-700">
                    Target Dose ({drugDef.unit}): {settings.dose.toFixed(drugDef.doseDecimalPlaces)}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      id={`${drugId}-target-dose-slider`}
                      min="0"
                      max={dynamicSliderMaxDose > 0 ? dynamicSliderMaxDose : drugDef.targetDoseStep *10} 
                      step={drugDef.targetDoseStep}
                      value={settings.dose}
                      onChange={(e) => handleTargetDoseChange(drugId, e.target.value)}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isDisabled || dynamicSliderMaxDose <=0} 
                    />
                    <input
                      type="number"
                      id={`${drugId}-target-dose-input`}
                      value={isDisabled ? "0".padEnd(drugDef.doseDecimalPlaces + (drugDef.doseDecimalPlaces > 0 ? 1: 0) , '0') : (settings.dose === 0 && document.activeElement !== document.getElementById(`${drugId}-target-dose-input`) ? "" : settings.dose.toFixed(drugDef.doseDecimalPlaces)) }
                      onChange={(e) => handleTargetDoseChange(drugId, e.target.value || '0')}
                      min="0"
                      max={doseInputMax} 
                      step={drugDef.targetDoseStep}
                      className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={drugDef.unit.split('/')[0]}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIS Score Modal */}
        {isVisModalOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" // Slightly lighter overlay
                onClick={() => setIsVisModalOpen(false)} 
            >
                <div 
                    className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all text-gray-900"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 flex items-center space-x-2">
                            <HeartPulseIcon />
                            <span>Vasoactive-Inotropic Score (VIS)</span>
                        </h2>
                        <button 
                            onClick={() => setIsVisModalOpen(false)} 
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            aria-label="Close VIS modal"
                        >
                            <XIcon />
                        </button>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-green-600 text-center mb-4">
                        {totalVisScore.toFixed(patientWeight <= 0 ? 0 : 1)}
                    </p>
                    <p className="text-xs text-gray-600 text-center mt-2 max-w-lg mx-auto">
                        VIS = Dopamine + Dobutamine + (Epinephrine * 100) + (Norepinephrine * 100) + (Milrinone * 10) + (Vasopressin * 10000). All doses in {drugDefinitions.norepinephrine.unit} except Vasopressin in {drugDefinitions.vasopressin.unit}. Dilutions in 50mL.
                    </p>
                     <button
                        onClick={() => setIsVisModalOpen(false)}
                        className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-150"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default App;
