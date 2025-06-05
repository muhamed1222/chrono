import request from 'supertest';

jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }));

process.env.VITE_SUPABASE_URL = 'http://localhost';
process.env.VITE_SUPABASE_ANON_KEY = 'key';

const { createApp } = jest.requireActual('../../api/index');

/**
 * @jest-environment node
 */

describe('Express API', () => {
  it('GET /api/clients возвращает список клиентов', async () => {
    const clientsSnake = [
      { id: '1', name: 'Test', industry: 'IT', color: '#fff', social_accounts: [] }
    ];

    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnValue({
          order: jest.fn(async () => ({ data: clientsSnake, error: null }))
        })
      }))
    } as unknown as any;

    const app = createApp(mockSupabase);

    const res = await request(app).get('/api/clients');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: '1', name: 'Test', industry: 'IT', color: '#fff', socialAccounts: [] }
    ]);
  });

  it('POST /api/posts создает пост', async () => {
    const postSnake = {
      id: '1',
      client_id: 'c1',
      content: 'hi',
      platforms: ['telegram'],
      scheduled_for: '2024-01-01T00:00:00Z',
      status: 'scheduled',
      created_at: 'now',
      updated_at: 'now'
    };

    const insertMock = jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(async () => ({ data: postSnake, error: null }))
      }))
    }));

    const mockSupabase = {
      from: jest.fn(() => ({ insert: insertMock }))
    } as unknown as any;

    const app = createApp(mockSupabase);
    const res = await request(app)
      .post('/api/posts')
      .send({
        clientId: 'c1',
        content: 'hi',
        platforms: ['telegram'],
        scheduledFor: '2024-01-01T00:00:00Z',
        status: 'scheduled',
        createdAt: 'now',
        updatedAt: 'now'
      });

    expect(insertMock).toHaveBeenCalledWith({
      client_id: 'c1',
      content: 'hi',
      platforms: ['telegram'],
      scheduled_for: '2024-01-01T00:00:00Z',
      status: 'scheduled',
      created_at: 'now',
      updated_at: 'now'
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      clientId: 'c1',
      content: 'hi',
      platforms: ['telegram'],
      scheduledFor: '2024-01-01T00:00:00Z',
      status: 'scheduled',
      createdAt: 'now',
      updatedAt: 'now'
    });
  });
});
