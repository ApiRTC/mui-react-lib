import React, { useContext, useEffect, useReducer } from 'react'

import { MediaStreamTrackFlowStatus } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { useThemeProps } from '@mui/material/styles'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'

import { stopPropagation } from './common'
import { StreamContext } from './StreamContext'

export interface VideoEnableButtonProps extends IconButtonProps {
    enabledTooltip?: string,
    disabledTooltip?: string,
    noVideoTooltip?: string,
    tooltipProps?: Omit<TooltipProps, 'title' | 'children'>,
    enabledIcon?: React.ReactNode,
    disabledIcon?: React.ReactNode
}

const COMPONENT_NAME = "VideoEnableButton";
export function VideoEnableButton(inProps: VideoEnableButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "video-enable-btn",
        enabledTooltip = "Video enabled, click to disable",
        disabledTooltip = "Video disabled, click to enable",
        noVideoTooltip = "No Video",
        tooltipProps = { placement: 'left', arrow: true },
        enabledIcon = <Icon fontSize={props.size}>videocam</Icon>,
        disabledIcon = <Icon fontSize={props.size}>videocam_off</Icon>,
        ...rest } = props;
    const ariaLabel = props['aria-label'] ?? "enable or disable video";

    // Toggling video on stream is not captured in react state
    // so using forceUpdate when video is changed will force rendering
    // based on props.stream.isVideoEnabled()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { stream } = useContext(StreamContext);

    useEffect(() => {
        if (stream) {
            const onVideoFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(`${COMPONENT_NAME}|onVideoFlowStatusChanged`, stream, mediaStreamTrackFlowStatus, stream.isVideoEnabled())
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

    const toggleVideo = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (!stream) {
            return
        }
        if (stream.isVideoEnabled()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(`${COMPONENT_NAME}|stream.disableVideo`, stream.isVideoEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream.disableVideo(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(`${COMPONENT_NAME}|stream.disableVideo failed`, reason)
                }
            })
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(`${COMPONENT_NAME}|stream.enableVideo`, stream.isVideoEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream.enableVideo(true).catch((reason: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(`${COMPONENT_NAME}|stream.enableVideo failed`, reason)
                }
            })
        }
        forceUpdate()
    };

    const title = stream && stream.hasVideo() ? (stream.isVideoEnabled() ? enabledTooltip : disabledTooltip) : noVideoTooltip;

    return <Tooltip title={title} {...tooltipProps}>
        <span /*required by mui tooltip in case button is disabled */
            onClick={stopPropagation} /* to prevent click on underlying Stream (which might be clickable) even if IconButton is disabled */>
            <IconButton id={id}
                aria-label={ariaLabel}
                {...rest}
                disabled={props.disabled || (stream && !stream.hasVideo())}
                onClick={toggleVideo}>
                {stream && stream.hasVideo() && stream.isVideoEnabled() ?
                    enabledIcon : disabledIcon}
            </IconButton>
        </span>
    </Tooltip>
}