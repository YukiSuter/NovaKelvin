import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Concert } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface ConcertSelectionProps {
  concerts: Concert[];
  selectedConcert: number | null;
  onSelectConcert: (concertId: number) => void;
  onContinue: () => void;
  loading: boolean;
}

export const ConcertSelection: React.FC<ConcertSelectionProps> = ({
  concerts,
  selectedConcert,
  onSelectConcert,
  onContinue,
  loading
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#008888] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading concerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Select a Concert</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {concerts.map((concert) => (
          <div
            key={concert.id}
            onClick={() => onSelectConcert(concert.id)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedConcert === concert.id
                ? "border-[#008888] bg-[#008888]/5"
                : "border-gray-200 hover:border-[#008888]/50"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">{concert.concert_name}</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-[#008888]" />
                {concert.concert_date}
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#008888]" />
                {concert.concert_time}
              </p>
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#008888]" />
                {concert.concert_location}
              </p>
              {concert.conductor && (
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-[#008888]">♪</span>
                  Conductor: {concert.conductor}
                </p>
              )}
            </div>
          </div>
        ))}
        <Button
          onClick={onContinue}
          disabled={!selectedConcert}
          className="w-full"
        >
          Continue to Ticket Selection
        </Button>
      </CardContent>
    </Card>
  );
};