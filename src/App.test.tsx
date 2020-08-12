import React from 'react';
import App from './App';
import { render, screen } from '@testing-library/react';

it('displays a click button', () => {
	render(<App />);
	expect(screen.getByRole('button')).toHaveTextContent('clicks 0');
});
