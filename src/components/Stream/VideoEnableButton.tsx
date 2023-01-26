import React, { useContext, useEffect, useReducer } from 'react'

import { MediaStreamTrackFlowStatus } from '@apirtc/apirtc'

import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
// Note to let Icon work, you have to have
// <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> in <head>

import { StreamContext } from './Stream'

export type VideoEnableButtonProps = {
    disabled?: boolean
};
const COMPONENT_NAME = "VideoEnableButton";
export function VideoEnableButton(props: VideoEnableButtonProps) {

    // Toggling video on stream is not captured in react state
    // so using forceUpdate when video is changed will force rendering
    // based on props.stream.isVideoEnabled()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const stream = useContext(StreamContext);

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
            stream?.disableVideo(true)
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.enableVideo", stream?.isVideoEnabled())
            }
            // Note : always set applyRemotely to true so that it is executed
            // remotely for remote Streams. For local Streams, the boolean is
            // not used.
            stream?.enableVideo(true)
        }
        forceUpdate()
    };

    return <IconButton id='mic' color="primary" aria-label="mic"
        disabled={props.disabled}
        onClick={toggleVideo}>
        {stream && stream.hasVideo() && stream.isVideoEnabled() ? <Icon>videocam</Icon> : <Icon>videocam_off</Icon>}
    </IconButton>
}