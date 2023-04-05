import { act, render } from '@testing-library/react';
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
      return {
        getId: () => { return opts.id },
        getOpts: () => { return opts },
        hasVideo: () => { return true },
        isVideoEnabled: () => { return true },
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

it("renders mic with stream with audio and audio enabled", () => {

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