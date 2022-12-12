export * from './components'

type LogLevel = {
    level: 'debug' | 'info' | 'warn' | 'error'
    isDebugEnabled: boolean
    isInfoEnabled: boolean
    isWarnEnabled: boolean
}

const INFO: LogLevel = { level: 'info', isDebugEnabled: false, isInfoEnabled: true, isWarnEnabled: true };

declare global {
    var apirtcMuiReactLibLogLevel: LogLevel;
    var setApirtcMuiReactLibLogLevel: Function;
}

// a default value MUST be set in case application using the library does not override it
globalThis.apirtcMuiReactLibLogLevel = INFO;

export function setLogLevel(logLevelText: 'debug' | 'info' | 'warn' | 'error' | string) {
    switch (logLevelText) {
        case 'debug':
            globalThis.apirtcMuiReactLibLogLevel = { level: 'debug', isDebugEnabled: true, isInfoEnabled: true, isWarnEnabled: true };
            break
        case 'info':
            globalThis.apirtcMuiReactLibLogLevel = INFO;
            break
        case 'warn':
            globalThis.apirtcMuiReactLibLogLevel = { level: 'warn', isDebugEnabled: false, isInfoEnabled: false, isWarnEnabled: true };
            break
        case 'error':
            globalThis.apirtcMuiReactLibLogLevel = { level: 'error', isDebugEnabled: false, isInfoEnabled: false, isWarnEnabled: false };
            break
        default:
            // in case null is passed as input, default to 'info'
            globalThis.apirtcMuiReactLibLogLevel = INFO;
    }
    return globalThis.apirtcMuiReactLibLogLevel
}

globalThis.setApirtcMuiReactLibLogLevel = setLogLevel;