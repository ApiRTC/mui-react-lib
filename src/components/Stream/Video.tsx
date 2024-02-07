import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { MediaStreamTrackFlowStatus, Stream } from '@apirtc/apirtc';

import Box, { type BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useThemeProps } from '@mui/material/styles';

import { StreamContext } from './StreamContext';

export interface VideoProps extends Omit<BoxProps, 'style'> {
    /**
     * Applies to the video element
     */
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
}

const COMPONENT_NAME = "Video";
export function Video(inProps: VideoProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = props.stream?.getId(),
        sx,
        // for video
        style,
        autoPlay = true, muted,
        pointer, pointerColor,
        progressColor,
        stream, sinkId,
        videoMutedTooltip = "Video muted",
        ...rest } = props;

    const { stream: ctxStream, muted: ctxMuted = false } = useContext(StreamContext);
    const s_stream = useMemo(() => stream ?? ctxStream, [ctxStream, stream]);
    const s_muted = useMemo(() => muted ?? ctxMuted, [ctxMuted, muted]);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Stream.isVideoMuted is not captured in react state
    // so using forceUpdate when FlowStatus changes will force rendering
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        const htmlMediaElement = videoRef?.current as any;
        if (s_stream && htmlMediaElement) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(`${COMPONENT_NAME}|useEffect stream`, htmlMediaElement, s_stream)
            }

            s_stream.attachToElement(htmlMediaElement)

            // manage isVideoMuted to display a spinner when track is muted for technical reasons
            // only works on chrome
            //
            const onVideoFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(`${COMPONENT_NAME}|onVideoFlowStatusChanged`, s_stream, mediaStreamTrackFlowStatus)
                }
                forceUpdate()
            };
            s_stream.on('videoFlowStatusChanged', onVideoFlowStatusChanged)
            s_stream.on('remoteVideoFlowStatusChanged', onVideoFlowStatusChanged)

            return () => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(`${COMPONENT_NAME}|useEffect stream destroy`)
                }
                htmlMediaElement.src = "";

                s_stream.removeListener('audioFlowStatusChanged', onVideoFlowStatusChanged)
                s_stream.removeListener('remoteAudioFlowStatusChanged', onVideoFlowStatusChanged)
            }
        }
    }, [s_stream])
    // No need to put videoRef.current because useRef does not trigger rerender anyways

    useEffect(() => {
        const htmlMediaElement = videoRef?.current as any;
        if (htmlMediaElement && sinkId) {
            // As of today 2022/11 setSinkId does not exist on HtmlMediaElement
            // while described on https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
            // It is not supported on Firefox.
            // To bypass typescript check, go through any
            //const htmlMediaElement = ref as any;
            if (htmlMediaElement.setSinkId) {
                htmlMediaElement.setSinkId(sinkId)
            }
        }
    }, [sinkId])

    return <Box sx={{ ...sx, position: 'relative' }} {...rest}>
        <video id={id} ref={videoRef} style={style}
            autoPlay={autoPlay} muted={s_muted} />
        {pointer && <Icon sx={{
            position: 'absolute',
            top: pointer.top, left: pointer.left, transform: 'translate(-50%,-50%)',
            opacity: 0.9
        }} color={pointerColor}>adjust</Icon>}
        {s_stream?.isVideoMuted() &&
            <Tooltip sx={{
                position: 'absolute',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)', // centered
                opacity: 0.9
            }} title={videoMutedTooltip}>
                <CircularProgress color={progressColor} />
            </Tooltip>}
    </Box>
}