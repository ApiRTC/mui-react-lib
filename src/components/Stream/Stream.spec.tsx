import { act, render } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { Stream as StreamComponent } from "./Stream";

import { setLogLevel } from '../..';

import '../../mock/getDisplayMedia.mock';

import { Stream } from "@apirtc/apirtc";

import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

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
        hasAudio: () => { return true },
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

it("renders with stream undefined", () => {
  const stream = undefined;
  act(() => { ReactDOM.createRoot(container).render(<StreamComponent stream={stream} />); });
  expect(container.textContent).toBe("");
});

it("renders with stream", () => {
  const stream = new Stream(null, { id: 'stream-01' });
  act(() => { ReactDOM.createRoot(container).render(<StreamComponent stream={stream} />); });
  expect(container.textContent).toBe("");
});

it("renders with stream and detectSpeaking", () => {
  const stream = new Stream(null, { id: 'stream-01' });

  //let root: any;
  //act(() => { root = ReactDOM.createRoot(container).render(<StreamComponent stream={stream} detectSpeaking={true} />); });

  const { container, unmount } = render(<StreamComponent stream={stream} detectSpeaking={true} />);
  expect(container.textContent).toBe("");

  //act(() => { root?.unmount(); });
  unmount();
  expect(container.textContent).toBe("");
});

