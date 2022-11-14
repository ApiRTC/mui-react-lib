import React, { createContext, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import IconButton from '@mui/material/IconButton'

// import VolumeUpIcon from '@mui/icons-material/VolumeUp'
// import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import Icon from '@mui/material/Icon'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import useToggle from '../../hooks/useToggle'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
const { Provider } = StreamContext;

export interface StreamProps {
    id?: string,
    name?: string,
    stream: ApiRtcStream,
    muted?: boolean,
    sinkId?: string,
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
                    {/* {muted ? <VolumeOffIcon /> : <VolumeUpIcon />} */}
                    {muted ? <Icon>volume_off</Icon> : <Icon>volume_up</Icon>}
                </IconButton>}
                {props.controls}
            </Stack>
        </Box>
    </Provider>
}