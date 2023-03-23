import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { VideoEnableButton } from "./VideoEnableButton";

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

it("renders videocam_off with no stream", () => {
  act(() => { render(<VideoEnableButton />, container); });
  expect(container.textContent).toBe("videocam_off");
});