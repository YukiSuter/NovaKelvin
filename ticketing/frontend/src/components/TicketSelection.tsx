import React from 'react';
import { Check } from 'lucide-react';
import { TicketType, TicketQuantities } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface TicketSelectionProps {
  ticketTypes: TicketType[];
  ticketQuantities: TicketQuantities;
  onQuantityChange: (ticketId: number, change: number) => void;
  onBack: () => void;
  onContinue: () => void;
  loading: boolean;
  validating: boolean;
}

export const TicketSelection: React.FC<TicketSelectionProps> = ({
  ticketTypes,
  ticketQuantities,
  onQuantityChange,
  onBack,
  onContinue,
  loading,
  validating
}) => {
  const getTotalTickets = () => {
    return Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#008888] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading ticket types...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ticketTypes.map((t_type) => (
          <div
            key={t_type.id}

            className={
              t_type.display_ticket
                ? "p-6 border-2 rounded-lg border-gray-200"
                : "p-6 border-2 rounded-lg border-red-200 hidden"
            }
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{t_type.ticket_label}</h3>
                <p className="text-gray-600 text-sm mt-1">{t_type.description}</p>
                {t_type.features && t_type.features.length > 0 && (
                  <ul className="space-y-1 text-sm text-gray-600 mt-3">
                    {t_type.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 mr-2 text-[#008888] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                  {Number(t_type.qty_available) < 20 && (
                      <p className="text-sm text-red-500 mt-2">
                          Few tickets available!
                      </p>
                  )}

              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-[#008888] mb-4">£{Number(t_type.price).toFixed(2)}</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onQuantityChange(t_type.id, -1)}
                    disabled={ticketQuantities[t_type.id] === 0}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {ticketQuantities[t_type.id] || 0}
                  </span>
                  <button
                    onClick={() => onQuantityChange(t_type.id, 1)}
                    disabled={ticketQuantities[t_type.id] >= t_type.qty_available}
                    className="w-10 h-10 rounded-full bg-[#008888] hover:bg-[#006666] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onContinue}
            disabled={getTotalTickets() === 0 || validating}
            className="flex-1"
          >
            {validating ? 'Validating...' : 'Continue to Checkout'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};