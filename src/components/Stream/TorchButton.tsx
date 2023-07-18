import React, { useContext, useEffect, useState } from 'react'

import { MediaStreamSettings, MediaTrackVideoConstraints } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { useThemeProps } from '@mui/material/styles'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'

import { StreamContext } from './StreamContext'

export interface TorchButtonProps extends IconButtonProps {
    torchOffTooltip?: string,
    torchOnTooltip?: string,
    tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
}

const COMPONENT_NAME = "TorchButton";
export function TorchButton(inProps: TorchButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "torch-btn",
        torchOffTooltip = "Turn off torch", torchOnTooltip = "Turn on torch",
        tooltipProps = { placement: 'left', arrow: true },
        ...rest
    } = props;
    const ariaLabel = props['aria-label'] ?? "torch";

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
        // stop propagation because the underlying Stream may be clickable
        event.stopPropagation()
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
                        advanced: [{ torch: newValue } as any]
                    } as any
                }).then(() => {
                    setTorch(newValue)
                    if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
                        console.debug(COMPONENT_NAME + "|stream.applyConstraints done")
                    }
                }).catch((error: any) => {
                    setTorch(videoSettings.torch)
                    if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                        console.warn(COMPONENT_NAME + "|stream.applyConstraints error", error, videoSettings.torch)
                    }
                })
            }).catch((error) => {
                if (globalThis.apirtcMuiReactLibLogLevel.isWarnEnabled) {
                    console.warn(COMPONENT_NAME + "|stream.getSettings", stream, error)
                }
            })
        }
    };

    const title = torch ? torchOffTooltip : torchOnTooltip;

    return <Tooltip title={title} {...tooltipProps}>
        <span>{/*required by mui tooltip in case button is disabled */}
            <IconButton id={id}
                aria-label={ariaLabel}
                {...rest}
                onClick={onToggleTorch}>
                {torch ?
                    <Icon fontSize={props.size}>flashlight_off</Icon> :
                    <Icon fontSize={props.size}>flashlight_on</Icon>}
            </IconButton>
        </span>
    </Tooltip>
}