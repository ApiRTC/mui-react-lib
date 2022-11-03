# mui-react-lib

This library offers **React/MUI** components to be used along with **ApiRTC** objects.

## Install

`npm install @apirtc/mui-react-lib`

## DEV

`sudo npm link ../m-visio-assist/node_modules/@apirtc/apirtc  ../m-visio-assist/node_modules/@apirtc/react-lib ../m-visio-assist/node_modules/react`

## Components

### RemoteStream

Use it to display any **ApiRTC** remote **Stream**.

```
import { RemoteStream } from '@apirtc/mui-react-lib'

<RemoteStream stream={stream}></RemoteStream>
```

## Configure log level

In console, or from web app code:

```
globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled=true
```

Available LogLevels : isDebugEnabled, isInfoEnabled, isWarnEnabled
