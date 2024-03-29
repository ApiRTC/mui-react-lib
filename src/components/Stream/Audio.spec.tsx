import { act, queryByTestId, render } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { Audio } from "./Audio";
import { StreamContext } from "./StreamContext";

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
        isRemote: false,
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
  act(() => { ReactDOM.createRoot(container).render(<Audio />); });
  expect(container.textContent).toBe("");
});

it("renders with no stream, sinkId", () => {
  act(() => { ReactDOM.createRoot(container).render(<Audio sinkId='a-sink-id' />); });
  expect(container.textContent).toBe("");
  //TODO: how to check
});

it("renders with no stream, onMouseMove", () => {
  act(() => { ReactDOM.createRoot(container).render(<Audio onMouseMove={jest.fn()} />); });
  expect(container.textContent).toBe("");
});

it("renders mic with stream with isRemote false", () => {

  const stream = new Stream(null, { id: 'stream-01' });
  stream.isRemote = false;
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  // act(() => {
  //   ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
  //     <Audio data-testid='DATA-TEST-ID' />
  //   </StreamContext.Provider>);
  // });
  const { container, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <Audio data-testid='DATA-TEST-ID' />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("mic");

  expect(queryByTestId(container, 'DATA-TEST-ID')).toBeTruthy();

  unmount();
  expect(container.textContent).toBe("");
});