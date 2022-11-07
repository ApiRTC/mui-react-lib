import React, { useContext, useEffect, useState } from 'react'

import { MediaTrackVideoConstraints, MediaStreamSettings } from '@apirtc/apirtc'

import IconButton from '@mui/material/IconButton'
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff'
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn'

import { StreamContext } from './Stream'

const COMPONENT_NAME = "TorchButton";
export function TorchButton() {

    const stream = useContext(StreamContext);

    const [torch, setTorch] = useState<boolean>(false);

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

        stream?.getSettings().then(settings => {
            if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                console.debug(COMPONENT_NAME + "|stream.getSettings", stream, settings)
            }
            const videoSettings: MediaTrackVideoConstraints = (settings as MediaStreamSettings).video;
            setTorch(videoSettings.torch ?? false)
        })

    }, [stream])

    const onToggleTorch = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (stream) {
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
        }
    };

    return <IconButton id='torch' color="primary" aria-label="torch" onClick={onToggleTorch}>
        {torch ? <FlashlightOffIcon /> : <FlashlightOnIcon />}
    </IconButton>
}