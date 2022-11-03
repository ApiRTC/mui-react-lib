import React, { useEffect, useReducer, useState } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import IconButton from '@mui/material/IconButton'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn'
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

import { MediaStreamSettings, MediaStreamTrackFlowStatus, MediaTrackVideoConstraints, Stream } from '@apirtc/apirtc'
import { VideoStream } from '@apirtc/react-lib'

export interface RemoteStreamProps {
    stream: Stream,
    onTakeSnapshot?: Function
}
const COMPONENT_NAME = "RemoteStream";
export default function RemoteStream(props: RemoteStreamProps) {

    // Toggling audio on stream is not captured in react state
    // so using forceUpdate when audio is changed will force rendering
    // based on props.stream.isAudioMuted()
    // TODO isAudioMuted is not consistent with new function enable/disableAudio
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [muted, setMuted] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean>(false);

    useEffect(() => {
        props.stream.getCapabilities().then(capabilities => {
            if (globalThis.apirtcMuiReactLibLogLevel.isInfoEnabled) {
                console.info(COMPONENT_NAME + "|stream.getCapabilities", props.stream, capabilities)
            }
        }).catch((error: any) => {
            if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                console.warn(COMPONENT_NAME + "|stream.getCapabilities", props.stream, error)
            }
        })
        props.stream.getConstraints().then(obj => {
            if (globalThis.apirtcMuiReactLibLogLevel.isInfoEnabled) {
                console.info(COMPONENT_NAME + "|stream.getConstraints", props.stream, obj)
            }
        }).catch((error: any) => {
            if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                console.warn(COMPONENT_NAME + "|stream.getConstraints", props.stream, error)
            }
        })

        // TODO APIRTC: should be triggered both when remote as enabled/disabled audio and when
        // we (as a subscriber) request enable/disable on the remote.
        // Event is only triggered here when the subscriber makes the enable/disable, but neither enabled or muted values from mediaStreamTrackFlowStatus change,
        // and also props.stream.isAudioMuted() is not updated (always returns false), despite the sound is actually disabled
        // => Opened JIRA https://apizee.atlassian.net/browse/APIRTC-1162
        const onAudioFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|onAudioFlowStatusChanged", props.stream, mediaStreamTrackFlowStatus, props.stream.isAudioMuted())
            }
            forceUpdate()
        }
        props.stream.on('audioFlowStatusChanged', onAudioFlowStatusChanged)
        return () => {
            props.stream.removeListener('audioFlowStatusChanged', onAudioFlowStatusChanged)
        }

    }, [props.stream])

    const onToggleMuted = () => {
        setMuted(value => !value)
    }

    const onToggleAudio = () => {
        if (props.stream.isAudioMuted()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.enableAudio")
            }
            props.stream.enableAudio()
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.disableAudio")
            }
            props.stream.disableAudio()
        }
        forceUpdate()
    };

    const onToggleTorch = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const stream: Stream = props.stream;
        stream.getSettings().then(settings => {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.getSettings", stream, settings)
            }
            const videoSettings: MediaTrackVideoConstraints = (settings as MediaStreamSettings).video;
            const newValue = !videoSettings.torch;
            stream.applyConstraints({
                video: {
                    torch: newValue,
                    advanced: [{ torch: newValue }]
                }
            }).then(() => {
                setTorch(newValue)
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|stream.applyConstraints done")
                }
            }).catch((error: any) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.applyConstraints error", error)
                }
            })
        }).catch((error) => {
            if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                console.warn(COMPONENT_NAME + "|stream.getSettings", stream, error)
            }
        })
    };

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (props.onTakeSnapshot) {
            props.onTakeSnapshot()
        }
    };

    return <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
    >
        <Box sx={{ position: 'relative' }}>
            <VideoStream stream={props.stream} muted={muted}></VideoStream>
            <Stack sx={{
                position: 'absolute',
                bottom: 8, float: 'right', right: 8,
                opacity: [0.9, 0.8, 0.7],
                zIndex: 1
            }}>
                <IconButton id='muted' color="primary" aria-label="muted" onClick={onToggleMuted}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <IconButton id='mic' color="primary" aria-label="mic" onClick={onToggleAudio}>
                    {props.stream.isAudioMuted() ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                <IconButton id='torch' color="primary" aria-label="torch" onClick={onToggleTorch}>
                    {torch ? <FlashlightOffIcon /> : <FlashlightOnIcon />}
                </IconButton>
                {props.onTakeSnapshot &&
                    <IconButton id='snapshot' color="primary" aria-label="snapshot" onClick={onTakeSnapshot}>
                        <CameraAltIcon />
                    </IconButton>}
            </Stack>
        </Box>
    </Stack>
}