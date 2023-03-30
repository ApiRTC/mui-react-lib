import { act } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { VideoEnableButton } from "./VideoEnableButton";

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

it("renders videocam_off with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<VideoEnableButton />); });
  expect(container.textContent).toBe("videocam_off");
});