import { act, fireEvent, getByRole, screen, waitFor } from '@testing-library/react';
import React from "react";
import ReactDOM from 'react-dom/client';

import { TorchButton } from "./TorchButton";

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
        applyConstraints: jest.fn(),
        getId: () => { return opts.id },
        getSettings: jest.fn(),
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

it("renders flashlight_on with no stream", () => {
  act(() => { ReactDOM.createRoot(container).render(<TorchButton />); });
  expect(container.textContent).toBe("flashlight_on");
});

it("renders with stream, flashlight_on, click to flashlight_off", async () => {

  const stream = new Stream(null, { id: 'stream-01' });

  const muted = false;
  const toggleMuted = () => {
    console.log('toggleMuted called')
  }

  const safeReject = (p: any) => {
    p.catch((ignore: any) => ignore);
    return p;
  };

  (stream.getSettings as any).mockReturnValueOnce(new Promise<any>((resolve, reject) => {
    resolve({ video: { torch: false } })
  })).mockReturnValueOnce(new Promise<any>((resolve, reject) => {
    resolve({ video: { torch: false } })
  })).mockReturnValueOnce(safeReject(new Promise<any>((resolve, reject) => {
    reject("whatever reason")
  })));
  (stream.applyConstraints as any).mockReturnValue(new Promise<void>((resolve, reject) => {
    resolve()
  }));

  act(() => {
    ReactDOM.createRoot(container).render(<StreamContext.Provider value={{ stream: stream, muted, toggleMuted }}>
      <TorchButton />
    </StreamContext.Provider>);
  });

  // Initially, torch is off, so the icon shall be to set it 'on'
  await waitFor(() => {
    expect(screen.getByText('flashlight_on')).toBeTruthy();
    expect(stream.getSettings).toHaveBeenCalledTimes(1);
    expect(stream.applyConstraints).toHaveBeenCalledTimes(0);
  }, { container });

  // Click to put torch on, applyConstraints succeeds, so the icon shall be to set torch 'off'
  fireEvent.click(getByRole(container, "button"));
  await waitFor(() => {
    expect(screen.getByText('flashlight_off')).toBeTruthy();
    expect(stream.getSettings).toHaveBeenCalledTimes(2);
    expect(stream.applyConstraints).toHaveBeenCalledTimes(1);
  });

  // Click, getSettings fails, icon shall remain 'off'
  fireEvent.click(getByRole(container, "button"));
  await waitFor(() => {
    expect(screen.getByText('flashlight_off')).toBeTruthy();
    expect(stream.getSettings).toHaveBeenCalledTimes(3);
    expect(stream.applyConstraints).toHaveBeenCalledTimes(1);
  });

  //
  // Prepare for a case where torch is currently on, and applyConstraints fails
  (stream.getSettings as any).mockReturnValue(new Promise<any>((resolve, reject) => {
    resolve({ video: { torch: true } })
  }));
  (stream.applyConstraints as any).mockReturnValue(safeReject(new Promise<void>((resolve, reject) => {
    reject('applyConstraints reject')
  })));

  // Click, then icon shall display to set torch off
  fireEvent.click(getByRole(container, "button"));
  await waitFor(() => {
    expect(screen.getByText('flashlight_off')).toBeTruthy();
    expect(stream.getSettings).toHaveBeenCalledTimes(4);
    expect(stream.applyConstraints).toHaveBeenCalledTimes(2);
  });
});