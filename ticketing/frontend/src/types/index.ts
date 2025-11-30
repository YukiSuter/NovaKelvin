export interface Concert {
  id: number;
  concert_name: string;
  concert_date: string;
  concert_time: string;
  concert_location: string;
  conductor?: string;
}

    export interface TicketType {
      id: number;
      ticket_label: string;
      description: string;
      price: number;
      qty_total: number;
      qty_available: number;
      qty_sold: number;
      display_ticket: boolean;
      price_id: string;
    }

export interface TicketQuantities {
  [key: number]: number;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}