'use client';

import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (password: string): { level: number; label: string; color: string; textColor: string; percentage: number } => {
    if (!password) {
      return { level: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-200', percentage: 0 };
    }

    let strength = 0;

    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;

    // Character variety checks
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasLowerCase) strength += 1;
    if (hasUpperCase) strength += 1;
    if (hasNumbers) strength += 1;
    if (hasSpecial) strength += 1;

    // Normalize to 0-4 scale
    const level = Math.min(4, Math.floor(strength / 1.5));

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-500', percentage: 20 },
      { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500', percentage: 40 },
      { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500', percentage: 60 },
      { label: 'Good', color: 'bg-green-400', textColor: 'text-green-400', percentage: 80 },
      { label: 'Strong', color: 'bg-green-600', textColor: 'text-green-600', percentage: 100 },
    ];

    return {
      level,
      ...levels[level],
    };
  };

  const strength = calculateStrength(password);

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              bar <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      {password && (
        <div className="flex justify-between items-center">
          <p className={`text-xs font-medium ${strength.textColor}`}>
            Password Strength: {strength.label}
          </p>
        </div>
      )}
    </div>
  );
}
