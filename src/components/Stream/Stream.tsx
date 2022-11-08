import React, { createContext, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import IconButton from '@mui/material/IconButton'

import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import useToggle from '../../hooks/useToggle'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
const { Provider } = StreamContext;

export interface StreamProps {
    id?: string,
    name?: string,
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
        <Box id={props.id} sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        }}>
            <video id={props.stream.getId()} style={{ maxWidth: '100%' }}
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
                {props.withMuteToggle && <IconButton id='muted' color="primary" aria-label="muted" onClick={toggleMuted}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>}
                {props.controls}
            </Stack>
        </Box>
    </Provider>
}