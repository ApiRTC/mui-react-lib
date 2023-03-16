import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { MediaStreamTrackFlowStatus, Stream } from '@apirtc/apirtc';

import { StreamContext } from './StreamContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export type VideoProps = {
    id?: string,
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
    onMouseMove?: (event: React.MouseEvent) => void
};
const COMPONENT_NAME = "Video";
export function Video(props: VideoProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { id = props.stream?.getId(), autoPlay = true } = props;

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

    return <>
        {videoMuted ? <Box sx={{ height: 200, width: 200 }}
            display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box> :
            <video id={id}
                style={{ maxWidth: '100%', display: 'block', ...props.style }}
                ref={videoRef}
                autoPlay={autoPlay} muted={muted}
                onMouseMove={props.onMouseMove} />}
    </>
}