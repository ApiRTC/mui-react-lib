import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { AudioEnableButton } from "./AudioEnableButton";
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
        //releaseCalled: false,
        getId: () => { return opts.id },
        //release: function () { this.releaseCalled = true }
        getOpts: () => { return opts },
        hasAudio: () => { return true },
        isAudioEnabled: () => { return true },
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
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders mic_off with no stream", () => {
  act(() => { render(<AudioEnableButton />, container); });
  expect(container.textContent).toBe("mic_off");
});

it("renders mic with stream with audio and audio enabled", () => {

  const stream = new Stream(null, { id: 'stream-01' });
  const muted = true;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  }

  act(() => {
    render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <AudioEnableButton />
    </StreamContext.Provider>, container);
  });

  expect(container.textContent).toBe("mic");
});