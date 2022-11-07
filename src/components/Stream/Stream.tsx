import React, { createContext, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import IconButton from '@mui/material/IconButton'

import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import { useToggle } from '../..'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
const { Provider } = StreamContext;

export interface StreamProps {
    stream: ApiRtcStream,
    muted?: boolean,
    withMuteToggle?: boolean,
    controls?: React.ReactNode
}
const COMPONENT_NAME = "Stream";
export default function Stream(props: StreamProps) {

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

    return <Provider value={props.stream}>
        <Box sx={{ display: 'inline-flex', position: 'relative' }}>
            <video id={props.stream.getId()} style={{ maxWidth: '100%' }}
                ref={videoRef}
                muted={muted}></video>
            <Stack sx={{
                position: 'absolute',
                bottom: 8, float: 'right', right: 8,
                opacity: [0.9, 0.8, 0.7],
                zIndex: 1
            }}>
                {props.withMuteToggle && <IconButton id='muted' color="primary" aria-label="muted" onClick={toggleMuted}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>}
                {props.controls}
            </Stack>
        </Box>
    </Provider>
}