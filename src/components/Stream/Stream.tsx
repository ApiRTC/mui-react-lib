import React, { createContext, useEffect, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

import type { SxProps } from '@mui/material'

import useToggle from '../../hooks/useToggle'

export const StreamContext = createContext<ApiRtcStream | undefined>(undefined);
export const MutedContext = createContext<{ muted: boolean; toggleMuted: () => void; }>({ muted: false, toggleMuted: () => { } });

const speakingBorder = {
    border: 1,
    borderColor: 'primary.main'
};

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
    sx?: SxProps,
    detectSpeaking?: boolean
    //children?: React.ReactNode //for now 'children' is declared here only to allow parent to put a space or line return in content // commented out because we can also use <Stream /> format and it works fine
}
const COMPONENT_NAME = "Stream";
export default function Stream(props: StreamProps) {

    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
        console.debug(COMPONENT_NAME + "|Rendering")
    }

    // default autoPlay
    const { autoPlay = true, detectSpeaking = false } = props;

    const { status: muted, toggleStatus: toggleMuted } = useToggle(props.muted || false);

    const [isSpeaking, setSpeaking] = useState(false);

    //const audioRef = useRef<HTMLAudioElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        //const ref = audioRef ?? videoRef;
        const htmlMediaElement = videoRef?.current as any;
        if (htmlMediaElement && props.stream) {
            props.stream.attachToElement(htmlMediaElement)
            return () => {
                htmlMediaElement.src = "";
            }
        }
    }, [props.stream])
    // No need to put videoRef.current because useRef does not trigger rerender anyways

    useEffect(() => {
        // TODO: NOT WORKING => Backlog Fred
        // need to activate per (remote) stream the detection for that particular stream
        // so that this component would register event listener only if detection is required
        //
        if (props.stream && detectSpeaking) {
            const on_audioAmplitude = (amplitudeInfo: any) => {
                // { "amplitude": 102.36, "isSpeaking": true }
                setSpeaking(amplitudeInfo.isSpeaking)
            };
            props.stream.on('audioAmplitude', on_audioAmplitude)
            // TODO: call method to enable speaker detection
            //props.stream.enable
            return () => {
                // TODO: call method to disable speaker detection
                props.stream.removeListener('audioAmplitude', on_audioAmplitude)
            }
        }
    }, [props.stream, detectSpeaking])

    useEffect(() => {
        //const ref = audioRef ?? videoRef;
        const htmlMediaElement = videoRef?.current as any;
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

    return <Box id={props.id} sx={{
        ...props.sx,
        position: 'relative',
        ...isSpeaking && speakingBorder
    }}>
        {/* {props.stream.hasVideo() ? */}
        <video id={props.stream.getId()}
            style={{ maxWidth: '100%', ...props.videoStyle }}
            ref={videoRef}
            autoPlay={autoPlay} muted={muted}
            onMouseMove={props.onMouseMove}></video>
        {/* : (props.stream.hasAudio() ? */}
        {/* <audio id={props.stream.getId()} controls
                ref={audioRef}
                autoPlay={autoPlay} muted={muted}>
            </audio>  */}
        {/* : <span>{props.stream.getId()}</span>)} */}
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