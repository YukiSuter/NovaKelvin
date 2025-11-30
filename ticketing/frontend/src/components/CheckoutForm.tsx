import React from 'react';
import { FormData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Input';

interface CheckoutFormProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  onFormChange,
  onBack,
  onSubmit,
  submitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onFormChange({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};