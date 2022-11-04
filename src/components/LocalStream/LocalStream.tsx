import React, { useEffect, useReducer } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import IconButton from '@mui/material/IconButton'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

import { Stream, MediaStreamTrackFlowStatus } from '@apirtc/apirtc'
import { VideoStream } from '@apirtc/react-lib'

export interface LocalStreamProps {
    stream: Stream,
}
const COMPONENT_NAME = "LocalStream";
export default function LocalStream(props: LocalStreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    // Toggling audio on stream is not captured in react state
    // so using forceUpdate when audio is changed will force rendering
    // based on props.stream.isAudioMuted()
    // TODO isAudioMuted is not consistent with new function enable/disableAudio
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        // TODO APIRTC: should be triggered both when local or peer requested enable/disable audio. It is only triggered when local does it.
        const onAudioFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|onAudioFlowStatusChanged", props.stream, mediaStreamTrackFlowStatus)
            }
            forceUpdate()
        }
        props.stream.on('audioFlowStatusChanged', onAudioFlowStatusChanged)
        return () => {
            props.stream.removeListener('audioFlowStatusChanged', onAudioFlowStatusChanged)
        }
    }, [props.stream])

    const toggleAudio = () => {
        if (props.stream.isAudioMuted()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.log(COMPONENT_NAME + "|enableAudio")
            }
            props.stream.enableAudio()
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.log(COMPONENT_NAME + "|disableAudio")
            }
            props.stream.disableAudio()
        }
        forceUpdate()
    };

    const onMicKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && props.stream.isAudioMuted()) {
            toggleAudio()
        }
    };

    const onMicKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && !props.stream.isAudioMuted()) {
            toggleAudio()
        }
    };

    return <Box sx={{ position: 'relative' }}>
        <VideoStream stream={props.stream} muted={true}></VideoStream>
        <Stack sx={{
            position: 'absolute',
            bottom: 8, float: 'right', right: 8,
            opacity: [0.9, 0.8, 0.7],
            zIndex: 1
        }}>
            <IconButton id='audio-control' aria-label='audio-control'
                color="primary" onClick={toggleAudio}
                onKeyDown={onMicKeyDown} onKeyUp={onMicKeyUp}>
                {props.stream.isAudioMuted() ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
        </Stack>
    </Box>
}