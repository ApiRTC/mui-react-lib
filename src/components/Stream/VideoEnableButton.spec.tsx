import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { VideoEnableButton } from "./VideoEnableButton";

import { StreamContext, setLogLevel } from '../..';

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
      let video = true;
      return {
        getId: () => { return opts.id },
        getOpts: () => { return opts },
        hasVideo: () => { return true },
        disableVideo: (remote: boolean) => {
          return new Promise<void>((resolve, reject) => {
            video = false;
            resolve()
          });
        },
        enableVideo: (remote: boolean) => {
          return new Promise<void>((resolve, reject) => {
            video = true;
            resolve()
          });
        },
        isVideoEnabled: () => { return video },
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

it("renders videocam_off with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<VideoEnableButton />); });
  expect(container.textContent).toBe("videocam_off");
});

it("renders with aria-label", () => {
  act(() => { ReactDOM.createRoot(container).render(<VideoEnableButton aria-label="TEST ARIA LABEL" />); });
  var element = document.querySelector('[aria-label="TEST ARIA LABEL"]');
  expect(element).toBeTruthy();
});

it("renders videocam with stream with video and video enabled", () => {

  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  const { container, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <VideoEnableButton />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("videocam");

  unmount()
  expect(container.textContent).toBe("");
});

it("renders videocam with stream with video and video enabled, toggle video", async () => {

  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  const { container, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <VideoEnableButton data-testid='a-test-id' />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("videocam");

  const btn = screen.getByTestId('a-test-id');

  // toggle
  fireEvent.click(btn);
  await waitFor(() => {
    expect(container.textContent).toBe("videocam_off");
  })

  // toggle again
  fireEvent.click(btn);
  await waitFor(() => {
    expect(container.textContent).toBe("videocam");
  })

  unmount()
  expect(container.textContent).toBe("");
});