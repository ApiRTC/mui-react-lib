import React, { useContext, useEffect, useState } from 'react'

import { MediaStreamSettings, MediaTrackVideoConstraints } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'

import { StreamContext } from './StreamContext'

export type TorchButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    disabled?: boolean,
    ariaLabel?: string,
};

const COMPONENT_NAME = "TorchButton";
export function TorchButton(inProps: TorchButtonProps) {

    const { id = "torch-btn", color = "primary", ariaLabel = "torch" } = inProps;

    const { stream } = useContext(StreamContext);

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

    return <IconButton id={id} color={color} aria-label={ariaLabel}
        disabled={inProps.disabled}
        onClick={onToggleTorch}>
        {/* {torch ? <FlashlightOffIcon /> : <FlashlightOnIcon />} */}
        {torch ? <Icon>flashlight_off</Icon> : <Icon>flashlight_on</Icon>}
    </IconButton>
}