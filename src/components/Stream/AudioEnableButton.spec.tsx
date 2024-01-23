import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import '../../mock/getDisplayMedia.mock';
//
import { Stream } from "@apirtc/apirtc";

import { AudioEnableButton } from "./AudioEnableButton";
import { StreamContext } from "./StreamContext";

import { setLogLevel } from '../..';

import UserEvent from '@testing-library/user-event';

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
        disableAudio: (remote: boolean) => {
          return new Promise<void>((resolve, reject) => {
            audio = false;
            resolve()
          });
        },
        enableAudio: (remote: boolean) => {
          return new Promise<void>((resolve, reject) => {
            audio = true;
            resolve()
          });
        },
        isAudioEnabled: () => { return audio },
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

it("renders mic_off with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<AudioEnableButton />); });
  expect(container.textContent).toBe("mic_off");
});

it("renders with aria-label", () => {
  act(() => { ReactDOM.createRoot(container).render(<AudioEnableButton aria-label="TEST ARIA LABEL" />); });
  var element = document.querySelector('[aria-label="TEST ARIA LABEL"]');
  expect(element).toBeTruthy();
});

it("renders mic with stream with audio and audio enabled", () => {

  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  // act(() => {
  //   ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
  //     <AudioEnableButton />
  //   </StreamContext.Provider>);
  // });
  const { container, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <AudioEnableButton />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("mic");

  unmount()
  expect(container.textContent).toBe("");
});

it("renders mic with stream with audio and audio enabled, toggle audio", async () => {

  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  const { container, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <AudioEnableButton data-testid='a-test-id' />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("mic");

  const btn = screen.getByTestId('a-test-id');

  // toggle
  act(() => {
    UserEvent.click(btn);
  })
  await waitFor(() => {
    expect(container.textContent).toBe("mic_off");
  })

  // toggle again
  fireEvent.click(btn);
  await waitFor(() => {
    expect(container.textContent).toBe("mic");
  })

  unmount()
  expect(container.textContent).toBe("");
});