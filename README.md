# mui-react-lib

This library offers **React/MUI** components to be used along with **ApiRTC** objects.

## Install

`npm install @apirtc/mui-react-lib`

also you will need to install

'<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'

in index.html <head> to make Icon work 

## DEV

`sudo npm link $HOME/reactworkspace/m-visio-assist/node_modules/@apirtc/apirtc $HOME/reactworkspace/m-visio-assist/node_modules/react --force`

`sudo npm link ../react-app-ts/node_modules/react`

`ln -s $HOME/reactworkspace/m-visio-assist/node_modules/react node_modules/react`

Or

`sudo npm link $HOME/reactworkspace/visio-assisted/node_modules/@apirtc/apirtc $HOME/reactworkspace/visio-assisted/node_modules/react --force`

## Components

### Stream

Use it to display any **ApiRTC** remote **Stream**.

```
import { Stream } from '@apirtc/mui-react-lib'

<Stream stream={stream}></Stream>
```

## Configure log level

Available log levels:

 * **debug**
 * **info**
 * **warn**
 * **error**

from web app code:

```
import { setLogLevel } from '@apirtc/mui-react-lib'

setLogLevel('warn')
```

from console:

```
setApirtcMuiReactLibLogLevel('debug')
```

[//]: # (ApiRtcMuiReactLib.setLogLevel('debug')) if loaded as umd package