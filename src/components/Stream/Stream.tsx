import React, { useEffect, useState } from 'react'

import type { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import useToggle from '../../hooks/useToggle'
import { StreamContext } from './StreamContext'

const speakingBorder = {
    border: 1,
    borderColor: 'primary.main'
};

export type StreamProps = {
    id?: string,
    sx?: SxProps,
    name?: string,
    nameColor?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    stream: ApiRtcStream | undefined,
    muted?: boolean,
    controls?: React.ReactNode,
    detectSpeaking?: boolean,
    children?: React.ReactNode
};
const COMPONENT_NAME = "Stream";
export function Stream(props: StreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    const { detectSpeaking = false, nameColor = "primary" } = props;

    const { value: muted, toggle: toggleMuted } = useToggle(props.muted || false);

    const [isSpeaking, setSpeaking] = useState(false);

    useEffect(() => {
        // TODO: NOT WORKING => Backlog Fred
        // need to activate per (remote) stream the detection for that particular stream
        // so that this component would register event listener only if detection is required
        //
        if (props.stream && detectSpeaking) {

            const l_stream = props.stream;

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
    }, [props.stream, detectSpeaking])

    return <StreamContext.Provider value={{ stream: props.stream, muted, toggleMuted }}>
        <Box id={props.id}
            sx={{
                width: 'fit-content',
                height: 'fit-content',
                ...props.sx,
                position: 'relative',
                ...isSpeaking && speakingBorder
            }}>
            {props.children}
            {props.name && <Chip sx={{
                position: 'absolute',
                top: 4, left: '50%', transform: 'translate(-50%)', // 4px from top and centered horizontally
                opacity: [0.9, 0.8, 0.7],
                zIndex: 1
            }} label={props.name} color={nameColor} />}
            <Stack sx={{
                position: 'absolute',
                float: 'right',
                bottom: 4, right: 4,
                opacity: [0.9, 0.8, 0.7],
                zIndex: 1
            }}>
                {props.controls}
            </Stack>
        </Box>
    </StreamContext.Provider>
}