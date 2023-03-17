import React, { useContext, useEffect, useReducer } from 'react'

import { MediaStreamTrackFlowStatus } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { useThemeProps } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

// Note: replaced by usage of Icon, because @mui/icons-material has no umd package available
// import MicIcon from '@mui/icons-material/Mic'
// import MicOffIcon from '@mui/icons-material/MicOff'
// Note to let Icon work, you have to have
// <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> in <head>

import { StreamContext } from './StreamContext'

export type AudioEnableButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    disabled?: boolean,
    ariaLabel?: string,
    enabledTooltip?: string,
    disabledTooltip?: string,
    noAudioTooltip?: string
};
const COMPONENT_NAME = "AudioEnableButton";
export function AudioEnableButton(inProps: AudioEnableButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "audio-enable-btn",
        color = "primary",
        ariaLabel = "enable or disable audio",
        enabledTooltip = "Audio enabled, click to disable",
        disabledTooltip = "Audio disabled, click to enable",
        noAudioTooltip = "No Audio" } = props;

    // Toggling audio on stream is not captured in react state
    // so using forceUpdate when audio is changed will force rendering
    // based on props.stream.isAudioEnabled()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { stream } = useContext(StreamContext);

    useEffect(() => {
        if (stream) {
            const onAudioFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|onAudioFlowStatusChanged", stream, mediaStreamTrackFlowStatus, stream.isAudioEnabled())
                }
                forceUpdate()
            };
            stream.on('audioFlowStatusChanged', onAudioFlowStatusChanged)
            stream.on('remoteAudioFlowStatusChanged', onAudioFlowStatusChanged)
            return () => {
                stream.removeListener('audioFlowStatusChanged', onAudioFlowStatusChanged)
                stream.removeListener('remoteAudioFlowStatusChanged', onAudioFlowStatusChanged)
            }
        }
    }, [stream])

    const toggleAudio = () => {
        if (stream?.isAudioEnabled()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.disableAudio", stream?.isAudioEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream?.disableAudio(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.disableAudio failed", reason)
                }
            })
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.enableAudio", stream?.isAudioEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream?.enableAudio(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.enableAudio failed", reason)
                }
            })
        }
        forceUpdate()
    };

    const onMicKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && !stream?.isAudioEnabled()) {
            toggleAudio()
        }
    };

    const onMicKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && stream?.isAudioEnabled()) {
            toggleAudio()
        }
    };

    const title = stream && stream.hasAudio() ? (stream.isAudioEnabled() ? enabledTooltip : disabledTooltip) : noAudioTooltip;

    return <Tooltip title={title}>
        <span>  {/*required by mui tooltip in case button is disabled */}
            <IconButton id={id} key={id} color={color} aria-label={ariaLabel}
                disabled={props.disabled || (stream && !stream.hasAudio())}
                onClick={toggleAudio}
                onKeyDown={onMicKeyDown} onKeyUp={onMicKeyUp}>
                {stream && stream.hasAudio() && stream.isAudioEnabled() ? <Icon>mic</Icon> : <Icon>mic_off</Icon>}
            </IconButton>
        </span>
    </Tooltip>
}