import { formatLocalISO } from '../time';

describe('formatLocalISO', () => {
  it('formats date in provided timezone', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const formatted = formatLocalISO(date, 'Europe/Moscow');
    expect(formatted).toBe('2024-01-01T03:00:00+03:00');
  });
});
