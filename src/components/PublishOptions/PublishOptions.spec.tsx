import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { PublishOptions } from "./PublishOptions";
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

it("renders", () => {
  const onChange = () => { };
  act(() => { render(<PublishOptions onChange={onChange} />, container); });
  //expect(container.textContent).toBe("Audio & VideoAudio OnlyVideo Only");

  const audioVideo = screen.getByRole("radio", { name: "Audio & Video" });
  expect((audioVideo as any).checked).toBe(true);

  const audioOnly = screen.getByRole("radio", { name: "Audio Only" });
  expect((audioOnly as any).checked).toBe(false);

  const videoOnly = screen.getByRole("radio", { name: "Video Only" });
  expect((videoOnly as any).checked).toBe(false);

  const leftClick = { button: 0 };
  fireEvent.click(audioOnly, leftClick);
  expect((audioVideo as any).checked).toBe(false);
  expect((audioOnly as any).checked).toBe(true);
  expect((videoOnly as any).checked).toBe(false);

  fireEvent.click(videoOnly, leftClick);
  expect((audioVideo as any).checked).toBe(false);
  expect((audioOnly as any).checked).toBe(false);
  expect((videoOnly as any).checked).toBe(true);

});
