import React, { useContext } from 'react';

import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { StreamContext } from './Stream';

export type MuteButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    disabled?: boolean,
    ariaLabel?: string,
};
const COMPONENT_NAME = "MuteButton";
export function MuteButton(inProps: MuteButtonProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { id = "mute-btn", color = "primary", ariaLabel = "mute" } = inProps;
    
    const { muted, toggleMuted } = useContext(StreamContext);

    return <IconButton id={id} color={color} aria-label={ariaLabel}
        disabled={inProps.disabled}
        onClick={toggleMuted}>
        {/* {muted ? <VolumeOffIcon /> : <VolumeUpIcon />} */}
        {muted ? <Icon>volume_off</Icon> : <Icon>volume_up</Icon>}
    </IconButton>
}