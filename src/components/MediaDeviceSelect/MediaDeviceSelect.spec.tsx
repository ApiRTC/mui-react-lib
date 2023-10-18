import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import UserEvent from '@testing-library/user-event';

import { unmountComponentAtNode } from "react-dom";

import { setLogLevel } from '../..';

import { MediaDeviceSelect, MediaDeviceSelectProps } from "./MediaDeviceSelect";

import '../../mock/getDisplayMedia.mock';

import { MediaDevice } from "@apirtc/apirtc";

// Set log level to max to maximize code coverage
setLogLevel('debug')

jest.mock('@apirtc/apirtc', () => {
  const originalModule = jest.requireActual('@apirtc/apirtc');
  return {
    __esModule: true,
    ...originalModule,
    MediaDevice: jest.fn().mockImplementation((id: string, type: string, label: string) => {
      return {
        getId: () => { return id },
        getType: () => type,
        getLabel: () => label
      }
    }),
  }
})

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

it("renders", () => {

  // First, test that a 'default' is generated if the browser does not provide some
  const props: MediaDeviceSelectProps = {
    devices: {},
    selectedDevice: undefined,
    setSelectedDevice: jest.fn()
  };
  const { rerender } = render(<MediaDeviceSelect {...props} />);

  const select = screen.getByTestId('test-media-device-selector');
  const btn = screen.getByRole("button");

  expect(select.textContent).toContain('Default');
  expect(btn.textContent).toBe('Default');
  expect(props.selectedDevice).toBeUndefined();

  // With a default already set by browser (chrome does this, firefox does not)
  const browserDefault = new MediaDevice('default', 'audioinput', 'BDefault');
  props.devices = {
    'default': browserDefault,
  };
  rerender(<MediaDeviceSelect {...props} />);

  expect(btn.textContent).toBe(browserDefault.getLabel());
  expect(props.selectedDevice).toBeUndefined();

  // With another device and a selected one
  const deviceA1 = new MediaDevice('a1', 'audioinput', 'deviceA1');
  props.devices = {
    [browserDefault.getId()]: browserDefault,
    [deviceA1.getId()]: deviceA1
  };
  rerender(<MediaDeviceSelect {...props} />);

  expect(btn.textContent).toBe(browserDefault.getLabel());
  expect(props.selectedDevice).toBeUndefined();

  // With a selected device
  props.selectedDevice = deviceA1;
  rerender(<MediaDeviceSelect {...props} />);

  expect(btn.textContent).toBe('deviceA1');
  expect(props.selectedDevice).toBe(deviceA1);

});

it("simulate clicks", async () => {
  const deviceA1 = new MediaDevice('a1', 'audioinput', 'deviceA1');
  const props: MediaDeviceSelectProps = {
    id: 'an-id',
    testid: 'a-test-id',
    devices: {
      [deviceA1.getId()]: deviceA1
    },
    selectedDevice: undefined,
    setSelectedDevice: jest.fn()
  };
  const { rerender } = render(<MediaDeviceSelect {...props} />);

  const select = screen.getByTestId('a-test-id');

  expect(select.textContent).toContain('Default');

  // click on select
  UserEvent.click(screen.getByRole("button"));

  // click to select device a1
  const dropdownItem = await screen.findByRole("option", { name: deviceA1.getLabel() });
  act(() => {
    UserEvent.click(dropdownItem)
  })

  await waitFor(() => {
    expect(props.setSelectedDevice).toHaveBeenCalledWith(deviceA1);
  })
});
