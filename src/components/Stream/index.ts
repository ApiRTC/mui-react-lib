import { createContext } from 'react'

import { Stream as ApiRtcStream } from '@apirtc/apirtc'

export { AudioEnableButton, AudioEnableButtonProps } from './AudioEnableButton'
export { MuteButton, MuteButtonProps } from './MuteButton'
export { Stream, StreamProps } from './Stream'
export { TorchButton, TorchButtonProps } from './TorchButton'
export { Video, VideoProps } from './Video'
export { VideoEnableButton, VideoEnableButtonProps } from './VideoEnableButton'

export const StreamContext = createContext<{ stream: ApiRtcStream | undefined, muted: boolean; toggleMuted: () => void; }>(
    { stream: undefined, muted: false, toggleMuted: () => { } });