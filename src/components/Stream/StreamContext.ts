import { createContext } from 'react';

import { Stream as ApiRtcStream } from '@apirtc/apirtc';

export const StreamContext = createContext<{ stream: ApiRtcStream | undefined, muted: boolean; toggleMuted: () => void; }>(
    { stream: undefined, muted: false, toggleMuted: () => { } });