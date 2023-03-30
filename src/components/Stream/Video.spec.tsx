import { act } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { StreamContext } from "./StreamContext";
import { Video } from "./Video";

import { setLogLevel } from '../..';

import '../../mock/getDisplayMedia.mock';

import { Stream } from "@apirtc/apirtc";

// Partial mocking @apirtc/apirtc module
// see https://jestjs.io/docs/mock-functions
jest.mock('@apirtc/apirtc', () => {
  const originalModule = jest.requireActual('@apirtc/apirtc');
  return {
    __esModule: true,
    ...originalModule,
    Stream: jest.fn().mockImplementation((data: MediaStream | null, opts: any) => {
      return {
        attachToElement: (element: HTMLElement) => { },
        getId: () => { return opts.id },
        on: (event: string, fn: Function) => { },
        removeListener: (event: string, fn: Function) => { }
      }
    }),
  }
})

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

it("renders with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<Video />); });
  expect(container.textContent).toBe("");
});

it("renders with stream", () => {

  const stream = new Stream(null, { id: 'stream-01' });

  const muted = false;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  act(() => {
    ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <Video />
    </StreamContext.Provider>);
  });

  expect(container.textContent).toBe("");
});