import React, { useContext, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useThemeProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { StreamContext } from './StreamContext';

export interface SnapshotButtonProps extends IconButtonProps {
    snapshotTooltip?: string,
    onSnapshot: (dataUrl: string) => Promise<void>
}

const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(inProps: SnapshotButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "snapshot-btn",
        snapshotTooltip = "Take snapshot", ...rest } = props;
    const ariaLabel = props['aria-label'] ?? "snapshot";

    const { stream } = useContext(StreamContext);

    const [inProgress, setInProgress] = useState(false);

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        // stop propagation because the underlying Stream may be clickable
        event.stopPropagation()
        if (stream) {
            setInProgress(true)
            stream.takeSnapshot()
                .then((dataUrl: string) => inProps.onSnapshot(dataUrl))
                .finally(() => {
                    setInProgress(false)
                })
        }
    };
    return <Tooltip title={snapshotTooltip}>
        <span><IconButton id={id}
            aria-label={ariaLabel}
            {...rest}
            disabled={inProps.disabled || inProgress}
            onClick={onTakeSnapshot}
            sx={{
                position: 'relative'
            }}>
            <Icon fontSize={props.size}>photo_camera</Icon>
            {inProgress && <CircularProgress
                sx={{
                    position: 'absolute'
                }}
                style={{ width: '100%', height: '100%' }}
            />}
        </IconButton></span>
    </Tooltip>
}