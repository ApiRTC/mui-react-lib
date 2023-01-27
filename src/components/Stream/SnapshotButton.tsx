import React, { useContext } from 'react'

import { Stream } from '@apirtc/apirtc'

import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'

import { StreamContext } from './Stream'

export type SnapshotButtonProps = {
    disabled?: boolean,
    onTakeSnapshot: (stream: Stream) => void
};
const COMPONENT_NAME = "SnapshotButton";
export function SnapshotButton(props: SnapshotButtonProps) {

    const stream = useContext(StreamContext);

    const onTakeSnapshot = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (stream) {
            props.onTakeSnapshot(stream)
        }
    };

    return <IconButton id='snapshot' color="primary" aria-label="snapshot"
        disabled={props.disabled}
        onClick={onTakeSnapshot}>
        <Icon>photo_camera</Icon>
    </IconButton>
}