import React, { useContext } from 'react';

import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { useThemeProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { StreamContext } from './StreamContext';

export type MuteButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning",
    disabled?: boolean,
    ariaLabel?: string,
    mutedTooltip?: string,
    unmutedTooltip?: string,
    noAudioTooltip?: string
};
const COMPONENT_NAME = "MuteButton";
export function MuteButton(inProps: MuteButtonProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "mute-btn", color = undefined, ariaLabel = "mute",
        mutedTooltip = "Muted", unmutedTooltip = "On",
        noAudioTooltip = "No Audio" } = props;

    const { stream, muted, toggleMuted } = useContext(StreamContext);

    const title = stream && stream.hasAudio() ? (muted ? mutedTooltip : unmutedTooltip) : noAudioTooltip;

    const _icon = stream && stream.hasAudio() ? (muted ? <Icon>volume_off</Icon> : <Icon>volume_up</Icon>) : <Icon>volume_off</Icon>;

    const onToggle = (event: React.SyntheticEvent) => {
        event.preventDefault()
        // stop propagation because the underlying Stream may be clickable
        event.stopPropagation()
        toggleMuted()
    };

    return <Tooltip title={title}>
        <span>{/*required by mui tooltip in case button is disabled */}
            <IconButton id={id} color={color} aria-label={ariaLabel}
                disabled={inProps.disabled || (stream && !stream.hasAudio())}
                onClick={onToggle}>
                {_icon}
            </IconButton>
        </span>
    </Tooltip>
}