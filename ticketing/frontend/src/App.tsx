import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Concert, TicketType, TicketQuantities, FormData } from './types';
import { api } from './services/api';
import { ProgressSteps } from './components/ProgressSteps';
import { ConcertSelection } from './components/ConcertSelection';
import { TicketSelection } from './components/TicketSelection';
import { StripeCheckout } from './components/StripeCheckout';
import { OrderSummary } from './components/OrderSummary';

export default function TicketsPage() {
  const [step, setStep] = useState(1);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcertId, setSelectedConcertId] = useState<number | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketQuantities, setTicketQuantities] = useState<TicketQuantities>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingConcerts, setLoadingConcerts] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [validating, setValidating] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);

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
          alert(`Sorry, only ${ticketType.qty_available} ${ticketType.ticket_label} tickets are now available. Please adjust your selection.`);

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
    if (!isValid) return;

    setCreatingCheckout(true);
    try {
      // Create checkout session
      const lineItems = Object.entries(ticketQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({
          ticket_type_id: parseInt(ticketTypeId),
          quantity
        }));

      const session = await api.createCheckoutSession(selectedConcertId!, lineItems);
      setClientSecret(session.client_secret);
      setSessionId(session.session_id);
      setStep(3);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setCreatingCheckout(false);
    }
  };

  const handlePaymentComplete = () => {
    // Reset and go back to step 1
    setStep(1);
    setSelectedConcertId(null);
    setTicketTypes([]);
    setTicketQuantities({});
    setClientSecret(null);
    setSessionId(null);
  };

  const selectedConcert = concerts.find(c => c.id === selectedConcertId) || null;

  return (
    <div className="max-w-6xl mx-auto">
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
              validating={validating || creatingCheckout}
            />
          )}

          {step === 3 && clientSecret && sessionId && (
            <StripeCheckout
              clientSecret={clientSecret}
              sessionId={sessionId}
              onBack={() => {
                setStep(2);
                setClientSecret(null);
                setSessionId(null);
              }}
              onComplete={handlePaymentComplete}
              concertName={selectedConcert?.concert_name || ''}
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