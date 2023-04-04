import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { Stream } from '@apirtc/apirtc';

import type { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { StreamContext } from './StreamContext';

export type AudioProps = {
    id?: string,
    'data-testid'?: string,
    sx?: SxProps,
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
const COMPONENT_NAME = "Audio";
export function Audio(props: AudioProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { id = props.stream?.getId(), autoPlay = true } = props;

    const { stream: ctxStream, muted: ctxMuted = false } = useContext(StreamContext);
    const stream = useMemo(() => props.stream ?? ctxStream, [ctxStream, props.stream]);
    const muted = useMemo(() => props.muted ?? ctxMuted, [ctxMuted, props.muted]);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const htmlMediaElement = audioRef?.current as any;
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
        const htmlMediaElement = audioRef?.current as any;
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

    return <Box sx={{ height: 100, width: 100, ...props.sx }} bgcolor="grey"
        display="flex" alignItems="center" justifyContent="center">
        {stream && <Icon fontSize='large'>{stream.isRemote ? 'headset_mic' : 'mic'}</Icon>}
        <audio id={id} data-testid={props['data-testid']} ref={audioRef}
            autoPlay={autoPlay} muted={muted}
            onMouseMove={props.onMouseMove} />
    </Box>
}