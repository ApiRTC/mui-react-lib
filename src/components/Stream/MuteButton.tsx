import React, { useContext } from 'react';

import Icon from '@mui/material/Icon';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { useThemeProps } from '@mui/material/styles';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

import { stopPropagation } from './common';
import { StreamContext } from './StreamContext';

export interface MuteButtonProps extends IconButtonProps {
    mutedTooltip?: string,
    unmutedTooltip?: string,
    noAudioTooltip?: string,
    tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
}

const COMPONENT_NAME = "MuteButton";
export function MuteButton(inProps: MuteButtonProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(`${COMPONENT_NAME}|Rendering`)
    }

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "mute-btn",
        mutedTooltip = "Muted", unmutedTooltip = "On",
        noAudioTooltip = "No Audio",
        tooltipProps = { placement: 'left', arrow: true },
        ...rest } = props;
    const ariaLabel = props['aria-label'] ?? "mute";

    const { stream, muted, toggleMuted } = useContext(StreamContext);

    const title = stream && stream.hasAudio() ? (muted ? mutedTooltip : unmutedTooltip) : noAudioTooltip;

    const _icon = stream && stream.hasAudio() ?
        (muted ? <Icon fontSize={props.size}>volume_off</Icon> : <Icon fontSize={props.size}>volume_up</Icon>) :
        <Icon fontSize={props.size}>volume_off</Icon>;

    const doToggle = (event: React.SyntheticEvent) => {
        event.preventDefault()
        toggleMuted()
    };

    return <Tooltip title={title} {...tooltipProps}>
        <span /*required by mui tooltip in case button is disabled */
            onClick={stopPropagation} /* to prevent click on underlying Stream (which might be clickable) even if IconButton is disabled */>
            <IconButton id={id}
                aria-label={ariaLabel}
                {...rest}
                disabled={inProps.disabled || (stream && !stream.hasAudio())}
                onClick={doToggle}>
                {_icon}
            </IconButton>
        </span>
    </Tooltip>
}