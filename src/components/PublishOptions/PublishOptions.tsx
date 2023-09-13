import React, { useEffect, useState } from "react";

import { PublishOptions as ApiRtcPublishOptions } from "@apirtc/apirtc";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useThemeProps } from "@mui/material/styles";

import useToggleArray from "../../hooks/useToggleArray";
import FormLabel from "@mui/material/FormLabel";

const PUBLISH_OPTIONS: Array<ApiRtcPublishOptions> = [
  {},
  { audioOnly: true },
  { videoOnly: true },
];

const toIndex = (publishOptions: ApiRtcPublishOptions): number => {
  if (publishOptions.audioOnly) {
    return 1;
  } else if (publishOptions.videoOnly) {
    return 2;
  }
  return 0;
};

export type PublishOptionsProps = {
  value: ApiRtcPublishOptions;
  onChange: (options: ApiRtcPublishOptions) => void;
  labelText?: string;
  audioAndVideoText?: string;
  audioOnlyText?: string;
  videoOnlyText?: string;
  audioAndVideoOption?: boolean;
  audioOnlyOption?: boolean;
  videoOnlyOption?: boolean;
};
const COMPONENT_NAME = "PublishOptions";
export function PublishOptions(inProps: PublishOptionsProps) {
  const props = useThemeProps({
    props: inProps,
    name: `ApiRtcMuiReactLib${COMPONENT_NAME}`,
  });
  const {
    labelText = "Publish options",
    audioAndVideoText = "Audio & Video",
    audioOnlyText = "Audio Only",
    videoOnlyText = "Video Only",
    audioAndVideoOption = true,
    audioOnlyOption = true,
    videoOnlyOption = true,
  } = props;

  const {
    value: publishOptions,
    index: publishOptionsIndex,
    setIndex: setPublishOptionsIndex,
  } = useToggleArray<ApiRtcPublishOptions>(
    PUBLISH_OPTIONS,
    toIndex(props.value)
  );

  useEffect(() => {
    setPublishOptionsIndex(toIndex(props.value));
  }, [JSON.stringify(props.value)]);

  useEffect(() => {
    props.onChange(publishOptions);
  }, [publishOptions]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishOptionsIndex(+(event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel id="publish-options-label">{labelText}</FormLabel>
      <RadioGroup
        aria-labelledby="publish-options-label"
        name="publish-options"
        value={String(publishOptionsIndex)}
        onChange={handleChange}
      >
        {audioAndVideoOption && (
          <FormControlLabel
            value="0"
            control={<Radio size="small" />}
            label={audioAndVideoText}
          />
        )}
        {audioOnlyOption && (
          <FormControlLabel
            value="1"
            control={<Radio size="small" />}
            label={audioOnlyText}
          />
        )}
        {videoOnlyOption && (
          <FormControlLabel
            value="2"
            control={<Radio size="small" />}
            label={videoOnlyText}
          />
        )}
      </RadioGroup>
    </FormControl>
  );
}
