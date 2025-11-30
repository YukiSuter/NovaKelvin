import React from 'react';

interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = ""
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008888] focus:border-transparent"
  />
);

export const Label: React.FC<{ children: React.ReactNode; htmlFor: string }> = ({
  children,
  htmlFor
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);