import { AudioEnableButtonProps } from "../components/Stream/AudioEnableButton";
import { MuteButtonProps } from "../components/Stream/MuteButton";
import { VideoEnableButtonProps } from "../components/Stream/VideoEnableButton";

export default interface Localization {
    components?: {
        ApiRtcMuiReactLibAudioEnableButton?: {
            defaultProps: Pick<AudioEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip' | 'noAudioToolTip'>;
        };
        ApiRtcMuiReactLibMuteButton?: {
            defaultProps: Pick<MuteButtonProps, 'ariaLabel' | 'mutedTooltip' | 'unmutedTooltip' | 'noAudioToolTip'>;
        };
        ApiRtcMuiReactLibVideoEnableButton?: {
            defaultProps: Pick<VideoEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip' | 'noVideoToolTip'>;
        };
    };
}