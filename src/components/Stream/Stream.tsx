import React, { Children, useEffect, useRef, useState } from 'react'

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

const mt = 4;
const mb = 8;
const mr = 4;

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

    const controlsRef = useRef(null);

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

    const [controlsSize, setControlsSize] = useState({ height: 0, width: 0 });

    useEffect(() => {
        const current = controlsRef.current as any;
        if (current) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|setControlsSize", current.clientHeight, current.clientWidth)
            }
            setControlsSize({ height: current.clientHeight, width: current.clientWidth })
        }
    }, [controlsRef])

    return <StreamContext.Provider value={{ stream: stream, muted: s_muted, toggleMuted }}>
        <Box id={id}
            sx={{
                minHeight: controlsSize.height + mb * 2 + (name ? 32 + mt : 0),
                minWidth: controls ? controlsSize.width * 2 + mr * 2 + 40 : 0,
                ...sx,
                position: 'relative',
                ...isSpeaking && speakingBorder
            }}
            display='flex' justifyContent='center' alignItems='center'
            {...rest}>
            {children}
            {name && <Chip sx={{
                position: 'absolute',
                top: { xs: mt, md: mt * 2, lg: mt * 4 }, left: '50%', transform: 'translate(-50%)', // 4px from top and centered horizontally
                opacity: 0.9
            }} label={name} color={nameColor} />}
            <Stack ref={controlsRef} sx={{
                position: 'absolute',
                float: 'right',
                bottom: { xs: mb, md: mb * 2, lg: mb * 4 }, right: { xs: mr, md: mr * 2, lg: mr * 4 },
                opacity: 0.9
            }}>
                {controls}
            </Stack>
        </Box>
    </StreamContext.Provider>
}