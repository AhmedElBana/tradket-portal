import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Forget from './Forget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Forget/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
