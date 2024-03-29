import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskElement from './TaskElement';

describe('TaskElement component', () => {
    const task = {
        title: 'Task title',
        description: 'Task description',
        category: {
            name: 'Category'
        },
        priority: 100,
        startDate: '2022-01-01',
        limitDate: '2022-01-02',
    };
});

test('renders TaskElement component', () => {
  render(<TaskElement task={task} />); // Pass the required props to TaskElement
  const element = screen.getByTestId('task-element'); // Use the appropriate data-testid
  expect(element).toBeInTheDocument();
});