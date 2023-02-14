import { AudioEnableButtonProps } from "../components/Stream/AudioEnableButton";

export default interface Localization {
    components?: {
        ApiRtcMuiReactLibAudioEnableButton?: {
            defaultProps: Pick<AudioEnableButtonProps, 'enabledTooltip' | 'disabledTooltip'>;
        };
    };
}