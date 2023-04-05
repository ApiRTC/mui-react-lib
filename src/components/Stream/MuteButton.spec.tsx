import { act, fireEvent, getByRole, screen, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';
import { MuteButton } from "./MuteButton";

import { setLogLevel, StreamContext } from '../..';

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

// it("renders volume_up with no stream", () => {
//   act(() => { render(<MuteButton />, container); });
//   expect(container.textContent).toBe("volume_off");
// });

it("renders volume_off with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<MuteButton />); });
  expect(container.textContent).toBe("volume_off");
});

it("renders with stream, not muted", async () => {
  const stream = new Stream(null, { id: 'stream-01' });
  const muted = false;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  }

  act(() => {
    ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <MuteButton />
    </StreamContext.Provider>);
  });

  await waitFor(() => {
    expect(screen.getByText('volume_up')).toBeTruthy();
  }, { container });
});

it("renders with stream, muted", async () => {
  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  }

  act(() => {
    ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <MuteButton />
    </StreamContext.Provider>);
  });

  await waitFor(() => {
    expect(screen.getByText('volume_off')).toBeTruthy();
  }, { container });
});