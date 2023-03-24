import React, { useContext } from 'react';

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
    onSnapshot: (dataUrl: string) => void
};
const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(inProps: SnapshotButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "snapshot-btn", color = "primary", ariaLabel = "snapshot",
        snapshotTooltip = "Take snapshot" } = props;

    const { stream } = useContext(StreamContext);

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (stream) {
            stream.takeSnapshot().then((dataUrl: string) => {
                inProps.onSnapshot(dataUrl)
            })
        }
    };

    return <Tooltip title={snapshotTooltip}>
        <span><IconButton id={id} color={color} aria-label={ariaLabel}
            disabled={inProps.disabled}
            onClick={onTakeSnapshot}>
            <Icon>photo_camera</Icon>
        </IconButton></span>
    </Tooltip>
}