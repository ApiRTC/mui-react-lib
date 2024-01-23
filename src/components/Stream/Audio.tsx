import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { Stream } from '@apirtc/apirtc';

import Box, { type BoxProps } from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { StreamContext } from './StreamContext';

export interface AudioProps extends BoxProps {
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
    sinkId?: string
}

const COMPONENT_NAME = "Audio";
export function Audio(props: AudioProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(`${COMPONENT_NAME}|Rendering`)
    }

    const { id = props.stream?.getId(),
        autoPlay = true, muted,
        stream, sinkId,
        ...rest } = props;

    const { stream: ctxStream, muted: ctxMuted = false } = useContext(StreamContext);
    const s_stream = useMemo(() => stream ?? ctxStream, [ctxStream, stream]);
    const s_muted = useMemo(() => muted ?? ctxMuted, [ctxMuted, muted]);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const htmlMediaElement = audioRef?.current as any;
        if (s_stream && htmlMediaElement) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(`${COMPONENT_NAME}|useEffect stream`, htmlMediaElement, s_stream)
            }
            s_stream.attachToElement(htmlMediaElement)
            return () => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(`${COMPONENT_NAME}|useEffect stream destroy`)
                }
                htmlMediaElement.src = "";
            }
        }
    }, [s_stream])
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

    return <Box display="flex" alignItems="center" justifyContent="center"
        {...rest}>
        {s_stream && <Icon fontSize='large'>{s_stream.isRemote ? 'headset_mic' : 'mic'}</Icon>}
        <audio id={id} ref={audioRef}
            autoPlay={autoPlay} muted={s_muted} />
    </Box>
}