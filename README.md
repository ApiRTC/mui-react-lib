# mui-react-lib

This library offers **React/MUI** components to be used along with **ApiRTC** objects.

## Install

`npm install @apirtc/mui-react-lib`

Also you will need to add

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
```

in index.html `<head>` to make Icons work.

## Components

### Stream

Use it to display any **ApiRTC** **Stream**. Example:

```tsx
import { MuteButton, Stream, Video } from '@apirtc/mui-react-lib'

<Stream stream={stream}
        muted={false}
        controls={<><MuteButton /></>}>
        <Video />
</Stream>
```

Available children:

```tsx
<Audio />
<Video />
```

Available controls:

```tsx
<AudioEnableButton/>
<MuteButton />
<SnapshotButton />
<TorchButton />
<VideoEnableButton/>
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