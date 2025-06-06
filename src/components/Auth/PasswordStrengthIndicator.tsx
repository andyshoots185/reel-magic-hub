
import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordRequirement } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  requirements: PasswordRequirement[];
}

const PasswordStrengthIndicator = ({ requirements }: PasswordStrengthIndicatorProps) => {
  const metCount = requirements.filter(req => req.met).length;
  const strengthPercentage = (metCount / requirements.length) * 100;
  
  const getStrengthColor = () => {
    if (strengthPercentage < 40) return 'bg-red-500';
    if (strengthPercentage < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthPercentage < 40) return 'Weak';
    if (strengthPercentage < 80) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Password Strength</span>
          <span className={`font-medium ${strengthPercentage >= 80 ? 'text-green-400' : strengthPercentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            {req.met ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <X size={16} className="text-red-400" />
            )}
            <span className={req.met ? 'text-green-400' : 'text-gray-400'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
