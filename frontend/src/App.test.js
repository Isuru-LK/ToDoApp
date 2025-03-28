import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({ data: { id: 1 } });
    axios.put.mockResolvedValue({ status: 204 });
  });

  test('renders form and inspiration section', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Add a Task')).toBeInTheDocument();
    expect(screen.getByText('Need Inspiration?')).toBeInTheDocument();
    expect(screen.getByText('Conquer Today, One Task at a Time!')).toBeInTheDocument();
  });

  test('adds a task', async () => {
    await act(async () => {
      render(<App />);
    });

    // Mock the fetchTasks response after adding a task
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Test Task', description: 'Test Desc' }]
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Task Title'), { target: { value: 'Test Task' } });
      fireEvent.change(screen.getByPlaceholderText('Task Description'), { target: { value: 'Test Desc' } });
      fireEvent.click(screen.getByText('Add Task'));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/tasks',
        { title: 'Test Task', description: 'Test Desc' }
      );
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  test('shows duplicate popup', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Task', description: 'Test Desc' }] });
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Task Title'), { target: { value: 'Test Task' } });
      fireEvent.change(screen.getByPlaceholderText('Task Description'), { target: { value: 'Test Desc' } });
      fireEvent.click(screen.getByText('Add Task'));
    });

    await waitFor(() => {
      expect(screen.getByText('Duplicate Task')).toBeInTheDocument();
      expect(screen.getByText('This task already exists. Please add a different one.')).toBeInTheDocument();
    });
  });

  test('completes a task', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Task', description: 'Test Desc' }] });
    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Done'));
    });

    await act(async () => {
      expect(screen.getByText('Mark as Done?')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to complete "Test Task"?')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Yes'));
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/tasks/1');
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });
  });
});