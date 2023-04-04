import { act, fireEvent, getByRole, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { SnapshotButton } from "./SnapshotButton";

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
        getId: () => { return opts.id },
        takeSnapshot: () => {
          return new Promise<string>((resolve, reject) => {
            resolve("dataUrl")
          });
        }
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

it("renders photo_camera with no stream", () => {
  const onSnapshot = async (dataUrl: string) => { };
  // const onSnapshot = jest.fn();
  act(() => { ReactDOM.createRoot(container).render(<SnapshotButton onSnapshot={onSnapshot} />); });
  expect(container.textContent).toBe("photo_camera");
});

it("renders photo_camera with stream, click calls takeSnapshot and onSnapshot callback prop", async () => {
  const stream = new Stream(null, { id: 'stream-01' });

  const muted = false;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  }

  const onSnapshot = jest.fn();

  act(() => {
    ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <SnapshotButton onSnapshot={onSnapshot} />
    </StreamContext.Provider>);
  });
  expect(container.textContent).toBe("photo_camera");

  fireEvent.click(getByRole(container, "button"));

  await waitFor(() => {
    expect(container.textContent).toBe("photo_camera");
    expect(onSnapshot).toHaveBeenCalledWith("dataUrl");
  });

});


