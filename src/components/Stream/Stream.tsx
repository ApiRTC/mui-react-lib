import React, { useEffect, useState } from 'react'

import Box, { type BoxProps } from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import useToggle from '../../hooks/useToggle'
import { StreamContext } from './StreamContext'

const speakingBorder = {
    border: 1,
    borderColor: 'primary.main'
};

export interface StreamProps extends BoxProps {
    name?: string,
    nameColor?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    stream: ApiRtcStream | undefined,
    muted?: boolean,
    controls?: React.ReactNode,
    detectSpeaking?: boolean,
}

const COMPONENT_NAME = "Stream";
export function Stream({
    id,
    children,
    controls,
    detectSpeaking = false,
    muted = false,
    name,
    nameColor = undefined,
    stream,
    sx,
    ...rest }: StreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { value: s_muted, toggle: toggleMuted } = useToggle(muted);

    const [isSpeaking, setSpeaking] = useState(false);

    useEffect(() => {
        // TODO: NOT WORKING => Backlog Fred
        // need to activate per (remote) stream the detection for that particular stream
        // so that this component would register event listener only if detection is required
        //
        if (stream && detectSpeaking) {
            const l_stream = stream;

            const on_audioAmplitude = (amplitudeInfo: any) => {
                // { "amplitude": 102.36, "isSpeaking": true }
                setSpeaking(amplitudeInfo.isSpeaking)
            };
            l_stream.on('audioAmplitude', on_audioAmplitude)
            // TODO: call method to enable speaker detection
            //props.stream.enable
            return () => {
                // TODO: call method to disable speaker detection
                l_stream.removeListener('audioAmplitude', on_audioAmplitude)
            }
        }
    }, [stream, detectSpeaking])

    return <StreamContext.Provider value={{ stream: stream, muted: s_muted, toggleMuted }}>
        <Box id={id}
            sx={{
                width: 'fit-content',
                height: 'fit-content',
                ...sx,
                position: 'relative',
                ...isSpeaking && speakingBorder
            }}
            {...rest}>
            {children}
            {name && <Chip sx={{
                position: 'absolute',
                top: 4, left: '50%', transform: 'translate(-50%)', // 4px from top and centered horizontally
                opacity: 0.9,
                zIndex: 1
            }} label={name} color={nameColor} />}
            <Stack sx={{
                position: 'absolute',
                float: 'right',
                bottom: 8, right: 4,
                opacity: 0.9,
                zIndex: 1
            }}>
                {controls}
            </Stack>
        </Box>
    </StreamContext.Provider>
}