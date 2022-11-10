import React from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { Stream } from '@apirtc/apirtc'
import { Credentials, useSession, useCameraStream, useConversation, useConversationStreams } from '@apirtc/react-lib'
import { AudioEnableButton } from '../Stream/AudioEnableButton'
import { default as StreamComponent } from '../Stream'
import { default as RemoteStreamsGrid } from '../Grid/Grid'

export type RoomProps = {
    name: string,
    credentials?: Credentials
};
const Room = ({ name, credentials }: RoomProps) => {

    const { session } = useSession(credentials ?? { apiKey: "myDemoApiKey" });
    const { stream: localStream } = useCameraStream(session);
    const { conversation } = useConversation(session,
        name, undefined, true);
    const { publishedStreams, subscribedStreams } = useConversationStreams(conversation, [localStream]);

    return <Box sx={{
        position: 'relative',
    }}>
        <RemoteStreamsGrid>
            {subscribedStreams.map((stream: Stream, index: number) =>
                <StreamComponent id={'subscribed-stream-' + index} key={index}
                    stream={stream} muted={false}
                    withMuteToggle={true}
                    controls={<AudioEnableButton />}></StreamComponent>
            )}
        </RemoteStreamsGrid>
        <Grid container direction="row" justifyContent="flex-start"
            sx={{
                position: 'absolute',
                bottom: 0, left: 0,
                opacity: [0.9, 0.8, 0.7],
            }}>
            {publishedStreams.map((stream, index) =>
                <Grid item id={'published-stream-' + index} key={index} xs={2}>
                    <StreamComponent stream={stream} muted={true}
                        controls={<AudioEnableButton />}></StreamComponent>
                </Grid>)}
        </Grid>
    </Box>
}
export default Room;