import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { SnapshotButton } from "./SnapshotButton";

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

it("renders photo_camera with no stream", () => {
  const onSnapshot = (dataUrl: string) => { };
  act(() => { render(<SnapshotButton onSnapshot={onSnapshot} />, container); });
  expect(container.textContent).toBe("photo_camera");
});