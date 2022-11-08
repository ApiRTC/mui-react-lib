import React, { useContext, useEffect, useReducer } from 'react'

import { MediaStreamTrackFlowStatus } from '@apirtc/apirtc'

import IconButton from '@mui/material/IconButton'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

import { StreamContext } from './Stream'

const COMPONENT_NAME = "AudioEnableButton";
export function AudioEnableButton() {

    // Toggling audio on stream is not captured in react state
    // so using forceUpdate when audio is changed will force rendering
    // based on props.stream.isAudioMuted()
    // TODO isAudioMuted is not consistent with new function enable/disableAudio
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const stream = useContext(StreamContext);

    useEffect(() => {
        // props.stream.getCapabilities().then(capabilities => {
        //     if (globalThis.apirtcMuiReactLibLogLevel.isInfoEnabled) {
        //         console.info(COMPONENT_NAME + "|stream.getCapabilities", props.stream, capabilities)
        //     }
        // }).catch((error: any) => {
        //     if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
        //         console.warn(COMPONENT_NAME + "|stream.getCapabilities", props.stream, error)
        //     }
        // })
        // props.stream.getConstraints().then(obj => {
        //     if (globalThis.apirtcMuiReactLibLogLevel.isInfoEnabled) {
        //         console.info(COMPONENT_NAME + "|stream.getConstraints", props.stream, obj)
        //     }
        // }).catch((error: any) => {
        //     if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
        //         console.warn(COMPONENT_NAME + "|stream.getConstraints", props.stream, error)
        //     }
        // })

        // TODO APIRTC: should be triggered both when remote as enabled/disabled audio and when
        // we (as a subscriber) request enable/disable on the remote.
        // Event is only triggered here when the subscriber makes the enable/disable, but neither enabled or muted values from mediaStreamTrackFlowStatus change,
        // and also props.stream.isAudioMuted() is not updated (always returns false), despite the sound is actually disabled
        // => Opened JIRA https://apizee.atlassian.net/browse/APIRTC-1162
        if (stream) {
            const onAudioFlowStatusChanged = (mediaStreamTrackFlowStatus: MediaStreamTrackFlowStatus) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                    console.debug(COMPONENT_NAME + "|onAudioFlowStatusChanged", stream, mediaStreamTrackFlowStatus, stream.isAudioMuted())
                }
                forceUpdate()
            }
            stream.on('audioFlowStatusChanged', onAudioFlowStatusChanged)
            return () => {
                stream.removeListener('audioFlowStatusChanged', onAudioFlowStatusChanged)
            }
        }
    }, [stream])

    const toggleAudio = () => {
        if (stream?.isAudioMuted()) {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.enableAudio")
            }
            stream?.enableAudio()
        } else {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.disableAudio")
            }
            stream?.disableAudio()
        }
        forceUpdate()
    };

    const onMicKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && stream?.isAudioMuted()) {
            toggleAudio()
        }
    };

    const onMicKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (e.key === " " && !stream?.isAudioMuted()) {
            toggleAudio()
        }
    };

    return <IconButton id='mic' color="primary" aria-label="mic"
        onClick={toggleAudio}
        onKeyDown={onMicKeyDown} onKeyUp={onMicKeyUp}>
        {stream && stream.isAudioMuted() ? <MicOffIcon /> : <MicIcon />}
    </IconButton>
}