import React, { useContext } from 'react'


import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'

import { MutedContext } from './Stream'

export interface MuteButtonProps {
    disabled?: boolean,
}
const COMPONENT_NAME = "MuteButton";
export function MuteButton(props: MuteButtonProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { muted, toggleMuted } = useContext(MutedContext);

    return <IconButton id='muted' color="primary" aria-label="muted"
        disabled={props.disabled}
        onClick={toggleMuted}>
        {/* {muted ? <VolumeOffIcon /> : <VolumeUpIcon />} */}
        {muted ? <Icon>volume_off</Icon> : <Icon>volume_up</Icon>}
    </IconButton>
}