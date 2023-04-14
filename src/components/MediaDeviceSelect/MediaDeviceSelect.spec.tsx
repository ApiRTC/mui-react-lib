import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

import { setLogLevel } from '../..';
import { MediaDeviceSelect } from "./MediaDeviceSelect";

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

it("renders", () => {

  const props = {
    devices: {},
    selectedDevice: undefined,
    setSelectedDevice: jest.fn()
  };
  const { rerender } = render(<MediaDeviceSelect {...props} />);

  // const audioVideo = screen.getByRole("select", { name: "Audio & Video" });
  // expect((audioVideo as any).checked).toBe(true);

});
