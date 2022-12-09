import React, { createContext, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import type { SxProps } from '@mui/material'

import useToggle from '../../hooks/useToggle'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
export const MutedContext = createContext<{ muted: boolean; toggleMuted: () => void; }>({ muted: false, toggleMuted: () => { } });

export interface StreamProps {
    id?: string,
    name?: string,
    stream: ApiRtcStream,
    autoPlay?: boolean,
    muted?: boolean,
    sinkId?: string,
    onMouseMove?: (event: React.MouseEvent) => void,
    controls?: React.ReactNode,
    videoStyle?: React.CSSProperties,
    sx?: SxProps
    //children?: React.ReactNode //for now 'children' is declared here only to allow parent to put a space or line return in content // commented out because we can also use <Stream /> format and it works fine
}
const COMPONENT_NAME = "Stream";
export default function Stream(props: StreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    // default autoPlay
    const { autoPlay = true } = props;

    const { status: muted, toggleStatus: toggleMuted } = useToggle(props.muted || false);

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const ref = videoRef.current;
        if (ref && props.stream) {
            props.stream.attachToElement(ref)
            return () => {
                ref.src = "";
            }
        }
    }, [props.stream])
    // No need to put videoRef.current because useRef does not trigger rerender anyways

    useEffect(() => {
        const ref = videoRef.current;
        if (ref && props.sinkId) {
            // As of today 2022/11 setSinkId does not exist on HtmlMediaElement
            // while described on https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
            // It is not supported on Firefox.
            // To bypass typescript check, go through any
            const htmlMediaElement = ref as any;
            if (htmlMediaElement.setSinkId) {
                htmlMediaElement.setSinkId(props.sinkId)
            }
        }
    }, [props.sinkId])

    return <Box id={props.id} sx={{
        ...props.sx,
        position: 'relative',
    }}>
        <video id={props.stream.getId()}
            style={{ maxWidth: '100%', ...props.videoStyle }}
            ref={videoRef}
            autoPlay={autoPlay}
            muted={muted}
            onMouseMove={props.onMouseMove}></video>
        {props.name && <Chip sx={{
            position: 'absolute',
            top: 4, left: '50%', transform: 'translate(-50%)', // 4px from top and centered horizontally
            opacity: [0.9, 0.8, 0.7],
            zIndex: 1
        }} label={props.name} color="primary" />}
        <Stack sx={{
            position: 'absolute',
            float: 'right',
            bottom: 4, right: 4,
            opacity: [0.9, 0.8, 0.7],
            zIndex: 1
        }}>
            <StreamContext.Provider value={props.stream}>
                <MutedContext.Provider value={{ muted, toggleMuted }}>
                    {props.controls}
                </MutedContext.Provider>
            </StreamContext.Provider>
        </Stack>
    </Box>
}