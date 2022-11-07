import React, { useContext } from 'react'

import { Stream } from '@apirtc/apirtc'

import IconButton from '@mui/material/IconButton'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

import { StreamContext } from './Stream'

export interface SnapshotButtonProps {
    onTakeSnapshot: (stream: Stream) => void
}
const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(props: SnapshotButtonProps) {

    const stream = useContext(StreamContext);

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (stream) {
            props.onTakeSnapshot(stream)
        }
    };

    return <IconButton id='snapshot' color="primary" aria-label="snapshot" onClick={onTakeSnapshot}>
        <CameraAltIcon />
    </IconButton>
}