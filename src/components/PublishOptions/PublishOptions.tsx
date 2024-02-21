import React, { useEffect } from "react";

import { PublishOptions as ApiRtcPublishOptions } from "@apirtc/apirtc";

import FormControl, { FormControlProps } from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useThemeProps } from "@mui/material/styles";

import useToggleArray from "../../hooks/useToggleArray";

const EMPTY: ApiRtcPublishOptions = {};
const PUBLISH_OPTIONS: Array<ApiRtcPublishOptions> = [
  EMPTY,
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

export interface PublishOptionsProps extends Omit<FormControlProps, 'value' | 'onChange'> {
  value: ApiRtcPublishOptions;
  onChange: (options: ApiRtcPublishOptions) => void;
  labelText?: string;
  audioAndVideoText?: string;
  audioOnlyText?: string;
  videoOnlyText?: string;
  audioAndVideoOption?: boolean;
  audioOnlyOption?: boolean;
  videoOnlyOption?: boolean;
}

const COMPONENT_NAME = "PublishOptions";
export function PublishOptions(inProps: PublishOptionsProps) {
  const props = useThemeProps({
    props: inProps,
    name: `ApiRtcMuiReactLib${COMPONENT_NAME}`,
  });
  const {
    value,
    onChange,
    labelText = "Publish options",
    audioAndVideoText = "Audio & Video",
    audioOnlyText = "Audio Only",
    videoOnlyText = "Video Only",
    audioAndVideoOption = true,
    audioOnlyOption = true,
    videoOnlyOption = true,
    ...rest
  } = props;

  const {
    value: publishOptions,
    index: publishOptionsIndex,
    setIndex: setPublishOptionsIndex,
  } = useToggleArray<ApiRtcPublishOptions>(
    PUBLISH_OPTIONS,
    toIndex(value)
  );

  useEffect(() => {
    setPublishOptionsIndex(toIndex(value));
  }, [value, setPublishOptionsIndex]);//JSON.stringify(value)

  useEffect(() => {
    onChange(publishOptions ?? EMPTY);
  }, [publishOptions, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishOptionsIndex(+(event.target as HTMLInputElement).value);
  };

  return <FormControl {...rest}>
    <FormLabel id="publish-options-label">{labelText}</FormLabel>
    <RadioGroup
      aria-labelledby="publish-options-label"
      name="publish-options"
      value={String(publishOptionsIndex)}
      onChange={handleChange}>
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
  </FormControl>;
}