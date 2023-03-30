import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

import { setLogLevel } from '../..';
import { PublishOptions } from "./PublishOptions";

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
    value: {},
    onChange: jest.fn()
  };
  const { rerender } = render(<PublishOptions {...props} />);

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
  expect(props.onChange).toHaveBeenCalledWith({
    audioOnly: true
  });

  fireEvent.click(videoOnly, leftClick);
  expect((audioVideo as any).checked).toBe(false);
  expect((audioOnly as any).checked).toBe(false);
  expect((videoOnly as any).checked).toBe(true);
  expect(props.onChange).toHaveBeenCalledWith({
    videoOnly: true
  });

  fireEvent.click(audioVideo, leftClick);
  expect((audioVideo as any).checked).toBe(true);
  expect((audioOnly as any).checked).toBe(false);
  expect((videoOnly as any).checked).toBe(false);
  expect(props.onChange).toHaveBeenCalledWith({});

  const update = { ...props, value: { audioOnly: true } };
  rerender(<PublishOptions {...update} />)
  expect((audioVideo as any).checked).toBe(false);
  expect((audioOnly as any).checked).toBe(true);
  expect((videoOnly as any).checked).toBe(false);

  const update2 = { ...props, value: { videoOnly: true } };
  rerender(<PublishOptions {...update2} />)
  expect((audioVideo as any).checked).toBe(false);
  expect((audioOnly as any).checked).toBe(false);
  expect((videoOnly as any).checked).toBe(true);

});
