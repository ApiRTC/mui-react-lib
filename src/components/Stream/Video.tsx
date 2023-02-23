import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { Stream } from '@apirtc/apirtc';

import { StreamContext } from './StreamContext';

export type VideoProps = {
    id?: string,
    style?: React.CSSProperties,
    stream?: Stream,
    autoPlay?: boolean,
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

    useEffect(() => {
        const htmlMediaElement = videoRef?.current as any;
        if (stream && htmlMediaElement) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|useEffect stream", htmlMediaElement, stream)
            }
            stream.attachToElement(htmlMediaElement)
            return () => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|useEffect stream destroy")
                }
                htmlMediaElement.src = "";
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

    return <video id={id}
        style={{ maxWidth: '100%', display: 'block', ...props.style }}
        ref={videoRef}
        autoPlay={autoPlay} muted={muted}
        onMouseMove={props.onMouseMove} />
}