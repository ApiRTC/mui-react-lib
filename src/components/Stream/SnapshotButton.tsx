import React, { useContext, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { useThemeProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { StreamContext } from './StreamContext';

export type SnapshotButtonProps = {
    id?: string,
    color?: any,
    disabled?: boolean,
    ariaLabel?: string,
    snapshotTooltip?: string,
    onSnapshot: (dataUrl: string) => Promise<void>
};
const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(inProps: SnapshotButtonProps) {

    const props = useThemeProps({ props: inProps, name: `ApiRtcMuiReactLib${COMPONENT_NAME}` });
    const { id = "snapshot-btn", color = undefined, ariaLabel = "snapshot",
        snapshotTooltip = "Take snapshot" } = props;

    const { stream } = useContext(StreamContext);

    const [inProgress, setInProgress] = useState(false);

    //const parentRef = useRef(null);
    //const progressSize = useMemo(() => Math.min(parentRef.current?.clientHeight, parentRef.current?.clientWidth), [parentRef]);

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
    return <Tooltip title={snapshotTooltip}>
        <span><IconButton id={id} color={color} aria-label={ariaLabel}
            disabled={inProps.disabled || inProgress}
            onClick={onTakeSnapshot}
            sx={{
                position: 'relative'
            }}>
            <Icon>photo_camera</Icon>
            {inProgress && <CircularProgress
                sx={{
                    position: 'absolute',
                    zIndex: 1
                }}
                style={{ width: '100%', height: '100%' }}
            />}
        </IconButton></span>
    </Tooltip>
}