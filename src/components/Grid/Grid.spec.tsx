import { act } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { Grid } from "./Grid";

import '../../mock/getDisplayMedia.mock';
//
import { Stream as ApirtcStream } from '@apirtc/apirtc';

import { Stream, setLogLevel } from '../..';

// Partial mocking @apirtc/apirtc module
// see https://jestjs.io/docs/mock-functions
jest.mock('@apirtc/apirtc', () => {
  const originalModule = jest.requireActual('@apirtc/apirtc');
  return {
    __esModule: true,
    ...originalModule,
    Stream: jest.fn().mockImplementation((data: MediaStream | null, opts: any) => {
      let audio = true;
      return {
        getId: () => { return opts.id },
        getOpts: () => { return opts },
        hasAudio: () => { return true },
        disableAudio: (remote: boolean) => { },
        enableAudio: (remote: boolean) => { },
        isAudioEnabled: () => { return audio },
        on: (event: string, fn: Function) => { },
        removeListener: (event: string, fn: Function) => { }
      }
    }),
  }
})

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

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

it("renders empty", () => {
  act(() => { ReactDOM.createRoot(container).render(<Grid children={[]} />); });
  expect(container.textContent).toBe("");
});

it("renders with Stream(s)", () => {
  const stream = new ApirtcStream(null, { id: 'stream-01' });

  act(() => { ReactDOM.createRoot(container).render(<Grid><Stream stream={stream}></Stream></Grid>); });
  expect(container.textContent).toBe("");

  act(() => {
    ReactDOM.createRoot(container).render(<Grid><Stream stream={stream}></Stream>
      <Stream stream={stream}></Stream></Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(4).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(6).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(9).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(12).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(24).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(42).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");

  act(() => {
    const children = Array(43).fill(<Stream stream={stream} />)
    ReactDOM.createRoot(container).render(<Grid>{children}</Grid>);
  });
  expect(container.textContent).toBe("");
});

