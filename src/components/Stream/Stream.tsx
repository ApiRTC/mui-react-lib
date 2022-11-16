import React, { createContext, useEffect, useRef, MouseEventHandler } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import useToggle from '../../hooks/useToggle'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
export const MutedContext = createContext<{ muted: boolean; toggleMuted: () => void; }>({ muted: false, toggleMuted: () => { } });

export interface StreamProps {
    id?: string,
    name?: string,
    stream: ApiRtcStream,
    muted?: boolean,
    sinkId?: string,
    onMouseMove?: (event: React.MouseEvent) => void,
    controls?: React.ReactNode,
    //children?: React.ReactNode //for now 'children' is declared here only to allow parent to put a space or line return in content
}
const COMPONENT_NAME = "Stream";
export default function Stream(props: StreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { status: muted, toggleStatus: toggleMuted } = useToggle(props.muted || false);

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const ref = videoRef.current;
        if (ref && props.stream) {
            props.stream.attachToElement(videoRef.current)
            ref.autoplay = true;
            return () => {
                ref.src = "";
            }
        }
    }, [props.stream])

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
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    }}>
        <video id={props.stream.getId()} style={{ maxWidth: '100%' }}
            onMouseMove={props.onMouseMove}
            ref={videoRef}
            muted={muted}></video>
        {props.name && <Chip sx={{
            position: 'absolute',
            top: 4,
            opacity: [0.9, 0.8, 0.7],
            zIndex: 1
        }} label={props.name} color="primary" />}
        <Stack sx={{
            position: 'absolute',
            float: 'right',
            bottom: 8, right: 8,
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