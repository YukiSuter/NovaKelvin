
import { Concert, TicketType } from '../types';

const API_BASE = '/api/tickets';

export const api = {
  async getConcerts(): Promise<Concert[]> {
    const response = await fetch(`${API_BASE}/concerts/`);
    if (!response.ok) throw new Error('Failed to fetch concerts');
    return response.json();
  },

  async getTicketTypes(concertId: number): Promise<TicketType[]> {
    const response = await fetch(`${API_BASE}/concert/tickettypes?concert_id=${concertId}`);
    if (!response.ok) throw new Error('Failed to fetch ticket types');
    return response.json();
  },
};