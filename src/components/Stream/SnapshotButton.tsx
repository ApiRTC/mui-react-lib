import React, { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { useThemeProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { StreamContext } from './StreamContext';

export type SnapshotButtonProps = {
    id?: string,
    color?: "primary" | "inherit" | "default" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    disabled?: boolean,
    ariaLabel?: string,
    snapshotTooltip?: string,
    onSnapshot: (dataUrl: string) => Promise<void>
};
const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(inProps: SnapshotButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "snapshot-btn", color = "primary", ariaLabel = "snapshot",
        snapshotTooltip = "Take snapshot" } = props;

    const { stream } = useContext(StreamContext);

    const [inProgress, setInProgress] = useState(false);

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (stream) {
            setInProgress(true)
            stream.takeSnapshot()
                .then((dataUrl: string) => inProps.onSnapshot(dataUrl))
                .finally(() => {
                    setInProgress(false)
                })
        }
    };

    return <Box sx={{
        position: 'relative'
    }}><Tooltip title={snapshotTooltip}>
            <span><IconButton id={id} color={color} aria-label={ariaLabel}
                disabled={inProps.disabled || inProgress}
                onClick={onTakeSnapshot}>
                <Icon>photo_camera</Icon>
            </IconButton></span>
        </Tooltip>
        {/* IconButton is 37px, so set CircularProgress size to 33 with 2px margin centers it */}
        {inProgress && <CircularProgress sx={{
            position: 'absolute',
            top: '2px', left: '2px',
            opacity: [0.9, 0.8, 0.7],
            zIndex: 1
        }} size={33} />}
    </Box>
}