import { act, findByLabelText, findByRole, findByTitle, getByRole, queryByRole, queryByTestId, render, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { StreamContext } from "./StreamContext";
import { Video } from "./Video";

import { setLogLevel } from '../..';

import '../../mock/getDisplayMedia.mock';

import { MediaStreamTrackFlowStatus, Stream } from "@apirtc/apirtc";

let videoMuted = false;
let on_videoFlowStatusChanged_cb: (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => void;

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
        isVideoMuted: () => { return videoMuted },
        on: (event: string, fn: Function) => {
          if (event === 'videoFlowStatusChanged') {
            on_videoFlowStatusChanged_cb = fn as any;
          }
        },
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

it("renders with no stream, sinkId", () => {
  act(() => { ReactDOM.createRoot(container).render(<Video sinkId='a-sink-id' />); });
  expect(container.textContent).toBe("");
  //TODO: how to check sinkId
});

it("renders with no stream, onMouseMove", () => {
  act(() => { ReactDOM.createRoot(container).render(<Video onMouseMove={jest.fn()} />); });
  expect(container.textContent).toBe("");
});

it("renders with stream", async () => {

  videoMuted = false;

  const stream = new Stream(null, { id: 'stream-01' });

  const muted = false;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  };

  const { container, rerender, unmount } = render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
    <Video data-testid='DATA-TEST-ID' />
  </StreamContext.Provider>);

  expect(container.textContent).toBe("");

  expect(queryByTestId(container, 'DATA-TEST-ID')).toBeDefined();

  act(() => {
    videoMuted = true;
    on_videoFlowStatusChanged_cb({
      enabled: true,//not tested
      muted: videoMuted
    })
  });
  await waitFor(() => {
    expect(queryByRole(container, "progressbar")).toBeDefined();
  })

  expect(container.textContent).toBe("");

  act(() => {
    videoMuted = false;
    on_videoFlowStatusChanged_cb({
      enabled: true,
      muted: videoMuted
    })
  });
  await waitFor(() => {
    expect(queryByRole(container, "progressbar")).toBeNull();
  })

  // Finally, set back to muted: true to test that changing stream removes the progressbar
  act(() => {
    videoMuted = true;
    on_videoFlowStatusChanged_cb({
      enabled: true,
      muted: videoMuted
    })
  });
  await waitFor(() => {
    expect(queryByRole(container, "progressbar")).toBeDefined();
  })
  // then
  // set to false as default
  videoMuted = false;
  // re-render
  const stream02 = new Stream(null, { id: 'stream-02' });
  rerender(<StreamContext.Provider value={{ stream: stream02, muted, toggleMuted }}>
    <Video data-testid='DATA-TEST-ID' />
  </StreamContext.Provider>)
  // and test
  await waitFor(() => {
    expect(queryByRole(container, "progressbar")).toBeNull();
  })

  unmount();

  expect(container.textContent).toBe("");
});