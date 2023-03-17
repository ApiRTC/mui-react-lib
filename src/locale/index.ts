import { AudioEnableButtonProps } from "../components/Stream/AudioEnableButton";
import { MuteButtonProps } from "../components/Stream/MuteButton";
import { VideoProps } from "../components/Stream/Video";
import { VideoEnableButtonProps } from "../components/Stream/VideoEnableButton";

export default interface Localization {
    components?: {
        ApiRtcMuiReactLibAudioEnableButton?: {
            defaultProps: Pick<AudioEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip' | 'noAudioTooltip'>;
        };
        ApiRtcMuiReactLibMuteButton?: {
            defaultProps: Pick<MuteButtonProps, 'ariaLabel' | 'mutedTooltip' | 'unmutedTooltip' | 'noAudioTooltip'>;
        };
        ApiRtcMuiReactLibVideo?: {
            defaultProps: Pick<VideoProps, 'videoMutedTooltip'>;
        };
        ApiRtcMuiReactLibVideoEnableButton?: {
            defaultProps: Pick<VideoEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip' | 'noVideoTooltip'>;
        };
    };
}