export * from './components'

type LogLevel = {
    isDebugEnabled: boolean
    isInfoEnabled: boolean
    isWarnEnabled: boolean
}

declare global {
    var apirtcMuiReactLibLogLevel: LogLevel;
}

// a default value MUST be set in case application using the library does not override it
globalThis.apirtcMuiReactLibLogLevel = { isDebugEnabled: false, isInfoEnabled: true, isWarnEnabled: true };
