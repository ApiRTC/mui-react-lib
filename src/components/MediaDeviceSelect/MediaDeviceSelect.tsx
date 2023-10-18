import React, { useMemo } from 'react'

import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'

import { MediaDevice } from '@apirtc/apirtc'

export interface MediaDeviceSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
    testid?: string,
    devices: {
        [key: string]: MediaDevice
    },
    selectedDevice: MediaDevice | undefined,
    setSelectedDevice: Function
}

const DEFAULT_ID = 'default';
const DEFAULT_LABEL = 'Default';

const COMPONENT_NAME = "MediaDeviceSelect";
export function MediaDeviceSelect(props: MediaDeviceSelectProps) {

    const { id = 'media-device-selector',
        devices,
        selectedDevice,
        setSelectedDevice,
        ...rest } = props;

    const onSelectDevice = (event: SelectChangeEvent<any>) => {
        event.preventDefault()
        if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
            console.debug(`${COMPONENT_NAME}|onSelectDevice`, event.target.value)
        }
        setSelectedDevice(devices[event.target.value])
    };

    const defaultDevice = useMemo(() => devices[DEFAULT_ID], [devices]);

    const _devices = Object.values(devices).map((device: MediaDevice) => {
        return <MenuItem key={device.getId()} value={device.getId()}>{device.getLabel()}</MenuItem>
    });

    return <Select id={id}
        value={selectedDevice ? selectedDevice.getId() : DEFAULT_ID}
        onChange={onSelectDevice}
        {...rest}>
        {!defaultDevice && <MenuItem key={DEFAULT_ID} value={DEFAULT_ID}>{DEFAULT_LABEL}</MenuItem>}
        {_devices}
    </Select>
}