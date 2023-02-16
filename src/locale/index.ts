import { AudioEnableButtonProps } from "../components/Stream/AudioEnableButton";
import { VideoEnableButtonProps } from "../components/Stream/VideoEnableButton";

export default interface Localization {
    components?: {
        ApiRtcMuiReactLibAudioEnableButton?: {
            defaultProps: Pick<AudioEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip'>;
        };
        ApiRtcMuiReactLibVideoEnableButton?: {
            defaultProps: Pick<VideoEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip'>;
        };
    };
}