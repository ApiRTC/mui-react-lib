import React, { useEffect, useState } from 'react'

import { Stream } from '@apirtc/apirtc'

import Grid from '@mui/material/Grid'

import { RemoteStream } from '..'

export interface RemoteStreamsProps {
    streams: Stream[],
    onTakeSnapshot?: (stream: Stream) => void
}
const COMPONENT_NAME = "RemoteStreams";
export default function RemoteStreams(props: RemoteStreamsProps) {

    //const takeSnapProp = props.onTakeSnapshot ? { onTakeSnapshot: () => props?.onTakeSnapshot(stream) } : {}

    const [responsive, setResponsive] = useState<any>({ xs: 12 });
    useEffect(() => {
        // This is R&D stuff, considering subscribedStreams.length would not exceed 12
        // (we would do pagination to 12 max otherwise)
        // Shall be improved if we would like to display more streams at a time...
        if (props.streams.length <= 1) {
            setResponsive({ xs: 12 })
        } else if (props.streams.length <= 2) {
            setResponsive({ xs: 12, sm: 6 })
        } else if (props.streams.length <= 6) {
            setResponsive({ xs: 12, sm: 6, md: 6, lg: 4 })
        } else if (props.streams.length <= 8) {
            setResponsive({ xs: 12, sm: 6, md: 6, lg: 3 })
        }
    }, [props.streams.length])

    return <Grid container direction="row" justifyContent="space-around" alignItems="center">
        {props.streams.map((stream: Stream, index: number) =>
            <Grid item id={'subscribed-stream-' + index} key={stream.getId()} {...responsive}>
                <RemoteStream stream={stream} onTakeSnapshot={props.onTakeSnapshot ? () => props.onTakeSnapshot?.(stream) : undefined}></RemoteStream>
            </Grid>
        )}
    </Grid>
}