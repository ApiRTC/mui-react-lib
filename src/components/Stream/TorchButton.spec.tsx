import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { TorchButton } from "./TorchButton";

import { setLogLevel } from '../..';

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

it("renders flashlight_on with no stream", () => {
  act(() => { render(<TorchButton />, container); });
  expect(container.textContent).toBe("flashlight_on");
});