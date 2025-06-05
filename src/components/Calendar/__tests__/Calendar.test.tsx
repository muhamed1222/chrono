import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Calendar from '../Calendar';
import { useAppContext } from '../../../context/AppContext';
import { Client } from '../../../types';

jest.mock('../../../context/AppContext', () => ({
  useAppContext: jest.fn()
}));

const client: Client = {
  id: 'c1',
  name: 'Test',
  industry: 'IT',
  color: '#fff',
  socialAccounts: []
};

const useCtx = useAppContext as jest.MockedFunction<typeof useAppContext>;

const wrapperFactory = () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

describe('Calendar', () => {
  it('отображает заголовок', () => {
    useCtx.mockReturnValue({ clients: [client], posts: [] } as any);
    const wrapper = wrapperFactory();
    const { getByText } = render(<Calendar />, { wrapper });
    expect(getByText('Календарь контента')).toBeInTheDocument();
  });

  it('кнопка добавления поста открывает редактор', () => {
    const setDate = jest.fn();
    const setView = jest.fn();
    useCtx.mockReturnValue({
      clients: [client],
      posts: [],
      role: 'editor',
      setSelectedDate: setDate,
      setCurrentView: setView
    } as any);
    const wrapper = wrapperFactory();
    const { getAllByLabelText } = render(<Calendar />, { wrapper });
    fireEvent.click(getAllByLabelText('Add post')[0]);
    expect(setDate).toHaveBeenCalledTimes(1);
    expect(setView).toHaveBeenCalledWith('post-editor');
  });
});
