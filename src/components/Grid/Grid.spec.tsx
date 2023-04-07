import { act } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { Grid } from "./Grid";

import { setLogLevel } from '../..';

// Set log level to max to maximize code coverage
setLogLevel('debug')

let container: any = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it("renders", () => {
  act(() => { ReactDOM.createRoot(container).render(<Grid children={[]} />); });
  expect(container.textContent).toBe("");
});
