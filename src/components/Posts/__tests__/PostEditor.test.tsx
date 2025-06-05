import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import PostEditor from '../PostEditor';
import { useAppContext } from '../../../context/AppContext';
import { Client } from '../../../types';
import { formatLocalISO } from '../../../utils/time';

jest.mock('../../../context/AppContext', () => ({
  useAppContext: jest.fn()
}));
jest.mock('../../../lib/storage', () => ({
  uploadFile: jest.fn()
}));
jest.mock('browser-image-compression', () => jest.fn());

const client: Client = {
  id: 'c1',
  name: 'Test',
  industry: 'IT',
  color: '#fff',
  socialAccounts: [
    { id: 's1', platform: 'telegram', handle: '@t', connected: true }
  ]
};

const useCtx = useAppContext as jest.MockedFunction<typeof useAppContext>;

const wrapperFactory = () => ({ children }: { children: React.ReactNode }) => <>{children}</>;

describe('PostEditor', () => {
  it('создает новый пост', async () => {
    const addPost = jest.fn().mockResolvedValue(undefined);
    const setView = jest.fn();
    useCtx.mockReturnValue({
      clients: [client],
      posts: [],
      role: 'editor',
      selectedClient: 'c1',
      selectedDate: '2024-01-02T00:00:00Z',
      addPost,
      updatePost: jest.fn(),
      setCurrentView: setView,
      showToast: jest.fn()
    } as any);
    const wrapper = wrapperFactory();

    const { getByPlaceholderText, getByText } = render(<PostEditor />, { wrapper });

    fireEvent.change(getByPlaceholderText('Введите текст публикации...'), { target: { value: 'Привет' } });

    await act(async () => {
      fireEvent.click(getByText('Запланировать'));
    });

    const scheduled = formatLocalISO(new Date('2024-01-02T12:00:00'));
    expect(addPost).toHaveBeenCalledWith({
      content: 'Привет',
      media: [],
      clientId: 'c1',
      platforms: ['telegram'],
      scheduledFor: scheduled,
      status: 'scheduled'
    });
    expect(setView).toHaveBeenCalledWith('calendar');
  });
});
