
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 border-b border-gray-200">
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <h2 className={`font-bold ${className}`}>
    {children}
  </h2>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);