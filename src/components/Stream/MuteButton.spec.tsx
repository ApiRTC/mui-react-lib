import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { MuteButton } from "./MuteButton";

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

it("renders volume_up with no stream", () => {
  act(() => { render(<MuteButton />, container); });
  expect(container.textContent).toBe("volume_up");
});