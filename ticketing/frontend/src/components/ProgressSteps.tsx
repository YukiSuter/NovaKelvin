import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Select Concert' },
    { number: 2, label: 'Choose Tickets' },
    { number: 3, label: 'Checkout' }
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`flex items-center ${currentStep >= step.number ? "text-[#008888]" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step.number ? "bg-[#008888] text-white" : "bg-gray-300"
              }`}>
                {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className="w-16 h-px bg-gray-300" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};