import React, { useEffect } from 'react'

import { PublishOptions as ApiRtcPublishOptions } from '@apirtc/apirtc'

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { useThemeProps } from '@mui/material/styles'

import useToggleArray from '../../hooks/useToggleArray'

const PUBLISH_OPTIONS: Array<ApiRtcPublishOptions> = [{ audioOnly: false, videoOnly: false }, { audioOnly: true }, { videoOnly: true }];

export type PublishOptionsProps = {
    onChange: (options: ApiRtcPublishOptions) => void,
    audioAndVideoText?: string,
    audioOnlyText?: string,
    videoOnlyText?: string
};
const COMPONENT_NAME = "PublishOptions";
export function PublishOptions(inProps: PublishOptionsProps) {

    const props = useThemeProps({ props: inProps, name: COMPONENT_NAME });
    const { audioAndVideoText = "Audio & Video", audioOnlyText = "Audio Only", videoOnlyText = "Video Only" } = props;

    const { value: publishOptions, index: publishOptionsIndex,
        setIndex: setPublishOptionsIndex } = useToggleArray(PUBLISH_OPTIONS);

    useEffect(() => {
        props.onChange(publishOptions)
    }, [publishOptions])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPublishOptionsIndex(+(event.target as HTMLInputElement).value)
    };

    return <FormControl>
        {/* <FormLabel id="publish-options">publish</FormLabel> */}
        <RadioGroup
            aria-labelledby="publish-options"
            name="publish-options"
            value={String(publishOptionsIndex)}
            onChange={handleChange}>
            <FormControlLabel value="0" control={<Radio size="small" />} label={audioAndVideoText} />
            <FormControlLabel value="1" control={<Radio size="small" />} label={audioOnlyText} />
            <FormControlLabel value="2" control={<Radio size="small" />} label={videoOnlyText} />
        </RadioGroup>
    </FormControl>
}
