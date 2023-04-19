import React from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

import { MediaDevice } from '@apirtc/apirtc'

export type MediaDeviceSelectProps = {
    id?: string,
    label?: string,
    disabled?: boolean,
    sx?: SxProps<Theme>,
    devices: {
        [key: string]: MediaDevice
    },
    selectedDevice: MediaDevice | undefined,
    setSelectedDevice: Function
};
const COMPONENT_NAME = "MediaDeviceSelect";
export function MediaDeviceSelect(props: MediaDeviceSelectProps) {

    const { id = 'media-device-selector', label = 'Select Device' } = props;

    const onSelectDevice = (event: SelectChangeEvent<string>) => {
        event.preventDefault()
        if (globalThis.apirtcMuiReactLibLogLevel.isDebugEnabled) {
            console.debug(COMPONENT_NAME + "|onSelectDevice", event.target.value)
        }
        props.setSelectedDevice(props.devices[event.target.value])
    };

    const _devices = Object.values(props.devices).map((device: MediaDevice) => {
        return <MenuItem key={device.getId()} value={device.getId()}>{device.getLabel()}</MenuItem>
    }).concat(<MenuItem key={'default'} value={'default'}>default</MenuItem>);

    return <FormControl sx={props.sx} fullWidth>
        <InputLabel id={id + "-label"}>{label}</InputLabel>
        <Select
            labelId={id + "-label"}
            id={id}
            value={props.selectedDevice ? props.selectedDevice.getId() : 'default'}
            label={label}
            disabled={props.disabled}
            onChange={onSelectDevice}>
            {_devices}
        </Select>
    </FormControl>
}