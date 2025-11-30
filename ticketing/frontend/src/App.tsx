import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Concert, TicketType, TicketQuantities, FormData } from './types';
import { api } from './services/api';
import { ProgressSteps } from './components/ProgressSteps';
import { ConcertSelection } from './components/ConcertSelection';
import { TicketSelection } from './components/TicketSelection';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderSummary } from './components/OrderSummary';

export default function TicketsPage() {
  const [step, setStep] = useState(1);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcertId, setSelectedConcertId] = useState<number | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketQuantities, setTicketQuantities] = useState<TicketQuantities>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingConcerts, setLoadingConcerts] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch concerts on mount
  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    setLoadingConcerts(true);
    try {
      const data = await api.getConcerts();
      setConcerts(data);
    } catch (error) {
      console.error('Error fetching concerts:', error);
      alert('Failed to load concerts. Please try again.');
    } finally {
      setLoadingConcerts(false);
    }
  };

  const fetchTicketTypes = async (concertId: number) => {
    setLoadingTickets(true);
    try {
      const data = await api.getTicketTypes(concertId);
      setTicketTypes(data);

      // Initialize ticket quantities
      const initialQuantities: TicketQuantities = {};
      data.forEach(type => {
        initialQuantities[type.id] = 0;
      });
      setTicketQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
      alert('Failed to load ticket types. Please try again.');
    } finally {
      setLoadingTickets(false);
    }
  };

  const validateAvailability = async (): Promise<boolean> => {
    if (!selectedConcertId) return false;

    setValidating(true);
    try {
      // Fetch fresh ticket data to check availability
      const freshTicketTypes = await api.getTicketTypes(selectedConcertId);

      // Check if requested quantities are still available
      for (const ticketType of freshTicketTypes) {
        const requestedQty = ticketQuantities[ticketType.id] || 0;
        if (requestedQty > ticketType.qty_available) {
          alert(`Sorry, only ${ticketType.qty_available} ${ticketType.name} tickets are now available. Please adjust your selection.`);

          // Update ticket types with fresh data
          setTicketTypes(freshTicketTypes);

          // Adjust quantities to maximum available
          setTicketQuantities(prev => ({
            ...prev,
            [ticketType.id]: Math.min(requestedQty, ticketType.qty_available)
          }));

          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating availability:', error);
      alert('Failed to validate ticket availability. Please try again.');
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleConcertSelect = (concertId: number) => {
    setSelectedConcertId(concertId);
    fetchTicketTypes(concertId);
  };

  const handleContinueToTickets = () => {
    if (selectedConcertId) {
      setStep(2);
    }
  };

  const handleTicketQuantityChange = (ticketId: number, change: number) => {
    setTicketQuantities(prev => {
      const newValue = Math.max(0, (prev[ticketId] || 0) + change);
      const ticketType = ticketTypes.find(t => t.id === ticketId);
      const maxValue = ticketType ? ticketType.qty_available : 0;
      return {
        ...prev,
        [ticketId]: Math.min(newValue, maxValue)
      };
    });
  };

  const handleContinueToCheckout = async () => {
    const isValid = await validateAvailability();
    if (isValid) {
      setStep(3);
    }
  };

  const handleSubmit = () => {
    if (!selectedConcertId) {
      alert("Please select a concert.");
      return;
    }

    const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
    if (totalTickets === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setStep(1);
        setSelectedConcertId(null);
        setTicketTypes([]);
        setTicketQuantities({});
        setFormData({ firstName: "", lastName: "", email: "", phone: "" });
      }, 3000);
    }, 1500);
  };

  const selectedConcert = concerts.find(c => c.id === selectedConcertId) || null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Check className="w-8 h-8 text-green-500 mr-2" />
            <h3 className="text-2xl font-bold text-green-800">Order Confirmed!</h3>
          </div>
          <p className="text-green-700">Your tickets have been reserved. Confirmation sent to {formData.email}</p>
        </div>
      )}

      {/* Progress Steps */}
      <ProgressSteps currentStep={step} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <ConcertSelection
              concerts={concerts}
              selectedConcert={selectedConcertId}
              onSelectConcert={handleConcertSelect}
              onContinue={handleContinueToTickets}
              loading={loadingConcerts}
            />
          )}

          {step === 2 && (
            <TicketSelection
              ticketTypes={ticketTypes}
              ticketQuantities={ticketQuantities}
              onQuantityChange={handleTicketQuantityChange}
              onBack={() => setStep(1)}
              onContinue={handleContinueToCheckout}
              loading={loadingTickets}
              validating={validating}
            />
          )}

          {step === 3 && (
            <CheckoutForm
              formData={formData}
              onFormChange={setFormData}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            concert={selectedConcert}
            ticketTypes={ticketTypes}
            ticketQuantities={ticketQuantities}
          />
        </div>
      </div>
    </div>
  );
}