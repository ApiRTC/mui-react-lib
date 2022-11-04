import React, { useEffect, useState } from 'react'

import { Stream } from '@apirtc/apirtc'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import Tooltip from '@mui/material/Tooltip'

import { LocalStream, RemoteStreams } from '..'
import useToggle from "../../hooks/useToggle"

const FULLSCREEN_PROPS = {
    position: 'absolute',
    top: '0px', right: '0px', bottom: '0px', left: '0px',
    zIndex: 'modal',
    width: '100vw', height: '100vh'
};
const INLINE_PROPS = {
    position: 'relative',
    width: "100%", height: '600px',
    'overflow-y': 'scroll'
};

export interface ConversationStreamsProps {
    subscribedStreams: Stream[],
    publishedStreams: Stream[],
    onTakeSnapshot?: (stream: Stream) => void
}
const COMPONENT_NAME = "ConversationStreams";
const ConversationStreams = (props: ConversationStreamsProps) => {

    const { status: fullscreen, toggleStatus: toggleFullScreen } = useToggle();

    // TODO:
    // This does NOT work fine because of two problems:
    // 1. the bgcolor does not work well in all modes when fullscreen : it always display white
    // 2. the fullscreen state is required by container component to not display other components
    // so it does not wor well to manage it here... so is there a point in trying to achieve this ?

    return <Box sx={fullscreen ? { bgcolor: 'background.default', ...FULLSCREEN_PROPS } : { ...INLINE_PROPS }}>
        <Tooltip title={fullscreen ? 'Leave Fullscreen' : 'Go Fullscreen'}>
            <IconButton id='go-leave-fullscreen' aria-label='go-leave-fullscreen'
                sx={{
                    position: 'relative',
                    float: 'right',
                    top: 16, right: 16,
                    zIndex: 1
                }} color="primary" onClick={toggleFullScreen}>
                {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
        </Tooltip>
        <RemoteStreams streams={props.subscribedStreams} onTakeSnapshot={props.onTakeSnapshot}></RemoteStreams>
        <Grid container direction="row" justifyContent="flex-start"
            sx={{
                position: 'absolute',
                bottom: 0, left: 0,
                opacity: [0.9, 0.8, 0.7],
            }}>
            {props.publishedStreams.map((stream, index) =>
                <Grid item id={'published-stream-' + index} key={index} xs={2}>
                    <LocalStream stream={stream}></LocalStream>
                </Grid>)}
        </Grid>
    </Box>
}

export default ConversationStreams;