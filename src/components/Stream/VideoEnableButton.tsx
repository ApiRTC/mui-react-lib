import React, { useContext, useEffect, useReducer } from 'react'

import { MediaStreamTrackFlowStatus } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { useThemeProps } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

import { StreamContext } from './StreamContext'

export type VideoEnableButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    disabled?: boolean,
    ariaLabel?: string,
    enabledTooltip?: string,
    disabledTooltip?: string,
    noVideoToolTip?: string
};
const COMPONENT_NAME = "VideoEnableButton";
export function VideoEnableButton(inProps: VideoEnableButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "video-enable-btn",
        color = "primary",
        ariaLabel = "enable or disable video",
        enabledTooltip = "Video enabled, click to disable",
        disabledTooltip = "Video disabled, click to enable",
        noVideoToolTip = "No Video" } = props;

    // Toggling video on stream is not captured in react state
    // so using forceUpdate when video is changed will force rendering
    // based on props.stream.isVideoEnabled()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { stream } = useContext(StreamContext);

    useEffect(() => {
        if (stream) {
            const onVideoFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|onVideoFlowStatusChanged", stream, mediaStreamTrackFlowStatus, stream.isVideoEnabled())
                }
                forceUpdate()
            };
            stream.on('videoFlowStatusChanged', onVideoFlowStatusChanged)
            stream.on('remoteVideoFlowStatusChanged', onVideoFlowStatusChanged)
            return () => {
                stream.removeListener('videoFlowStatusChanged', onVideoFlowStatusChanged)
                stream.removeListener('remoteVideoFlowStatusChanged', onVideoFlowStatusChanged)
            }
        }
    }, [stream])

    const toggleVideo = () => {
        if (stream?.isVideoEnabled()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.disableVideo", stream?.isVideoEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream?.disableVideo(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.disableVideo failed", reason)
                }
            })
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.enableVideo", stream?.isVideoEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream?.enableVideo(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.enableVideo failed", reason)
                }
            })
        }
        forceUpdate()
    };

    const title = stream && stream.hasVideo() ? (stream.isVideoEnabled() ? enabledTooltip : disabledTooltip) : noVideoToolTip;

    return <Tooltip title={title}>
        <span> {/*required by mui tooltip in case button is disabled */}
            <IconButton id={id} key={id} color={color} aria-label={ariaLabel}
                disabled={props.disabled || (stream && !stream.hasVideo())}
                onClick={toggleVideo}>
                {stream && stream.hasVideo() && stream.isVideoEnabled() ? <Icon>videocam</Icon> : <Icon>videocam_off</Icon>}
            </IconButton>
        </span>
    </Tooltip>
}