# mui-react-lib

This library offers **React/MUI** components to be used along with **ApiRTC** objects.

## Install

`npm install @apirtc/mui-react-lib`

also you will need to install

'<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'

in index.html <head> to make Icon work 

## Components

### Stream

Use it to display any **ApiRTC** remote **Stream**. Example:

```tsx
import { Stream } from '@apirtc/mui-react-lib'

<Stream stream={stream}
        muted={false}
        controls={<><MuteButton /></>}/>
```

## Configure log level

Available log levels:

 * **debug**
 * **info**
 * **warn**
 * **error**

from web app code:

```ts
import { setLogLevel } from '@apirtc/mui-react-lib'

setLogLevel('warn')
```

from console:

```js
setApirtcMuiReactLibLogLevel('debug')
```