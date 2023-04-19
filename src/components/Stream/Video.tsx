import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { MediaStreamTrackFlowStatus, Stream } from '@apirtc/apirtc';

import type { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useThemeProps } from '@mui/material/styles';

import { StreamContext } from './StreamContext';

export type VideoProps = {
    id?: string,
    'data-testid'?: string,
    sx?: SxProps,
    style?: React.CSSProperties,
    /**
     * Can be set directly, or be passed through StreamContext.
     */
    stream?: Stream,
    /**
     * @defaultValue true */
    autoPlay?: boolean,
    /**
     * Can be set directly, or be passed through StreamContext.
     * @defaultValue false */
    muted?: boolean,
    sinkId?: string,
    pointer?: { top: number | string, left: number | string },
    pointerColor?: any,
    progressColor?: "primary" | "inherit" | "secondary" | "error" | "info" | "success" | "warning",
    videoMutedTooltip?: string,
    onMouseMove?: (event: React.MouseEvent) => void
};
const COMPONENT_NAME = "Video";
export function Video(inProps: VideoProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = props.stream?.getId(),
        autoPlay = true,
        pointerColor = undefined,
        progressColor = undefined,
        videoMutedTooltip = "Video muted" } = props;

    const { stream: ctxStream, muted: ctxMuted = false } = useContext(StreamContext);
    const stream = useMemo(() => props.stream ?? ctxStream, [ctxStream, props.stream]);
    const muted = useMemo(() => props.muted ?? ctxMuted, [ctxMuted, props.muted]);

    const videoRef = useRef<HTMLVideoElement>(null);

    const [videoMuted, setVideoMuted] = useState(false);

    useEffect(() => {
        const htmlMediaElement = videoRef?.current as any;
        if (stream && htmlMediaElement) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|useEffect stream", htmlMediaElement, stream)
            }
            stream.attachToElement(htmlMediaElement)

            // manage isVideoMuted to display a spinner when track is muted for technical reasons
            // only works on chrome
            //
            const onVideoFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|onVideoFlowStatusChanged", stream, mediaStreamTrackFlowStatus)
                }
                setVideoMuted(mediaStreamTrackFlowStatus.muted)
            };
            stream.on('videoFlowStatusChanged', onVideoFlowStatusChanged)
            stream.on('remoteVideoFlowStatusChanged', onVideoFlowStatusChanged)

            return () => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|useEffect stream destroy")
                }
                htmlMediaElement.src = "";

                stream.removeListener('audioFlowStatusChanged', onVideoFlowStatusChanged)
                stream.removeListener('remoteAudioFlowStatusChanged', onVideoFlowStatusChanged)
            }
        }
    }, [stream])
    // No need to put videoRef.current because useRef does not trigger rerender anyways

    useEffect(() => {
        const htmlMediaElement = videoRef?.current as any;
        if (htmlMediaElement && props.sinkId) {
            // As of today 2022/11 setSinkId does not exist on HtmlMediaElement
            // while described on https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
            // It is not supported on Firefox.
            // To bypass typescript check, go through any
            //const htmlMediaElement = ref as any;
            if (htmlMediaElement.setSinkId) {
                htmlMediaElement.setSinkId(props.sinkId)
            }
        }
    }, [props.sinkId])

    return <Box sx={{ ...props.sx, position: 'relative' }}>
        <video id={id} data-testid={props['data-testid']}
            style={props.style}
            ref={videoRef}
            autoPlay={autoPlay} muted={muted}
            onMouseMove={props.onMouseMove} />
        {props.pointer && <Icon sx={{
            position: 'absolute',
            //top: props.pointer.y - 12, left: props.pointer.x - 12, // icon is 24x24px, so offset to mid
            top: props.pointer.top, left: props.pointer.left, transform: 'translate(-50%,-50%)',
            opacity: 0.9,
            zIndex: 1
        }} color={pointerColor}>adjust</Icon>}
        {videoMuted &&
            <Tooltip sx={{
                position: 'absolute',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)', // centered
                opacity: 0.9,
                zIndex: 1
            }} title={videoMutedTooltip}>
                <CircularProgress color={progressColor} />
            </Tooltip>}
    </Box>
}