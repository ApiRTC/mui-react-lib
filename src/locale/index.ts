import { PublishOptionsProps } from "../components/PublishOptions/PublishOptions";
import { AudioEnableButtonProps } from "../components/Stream/AudioEnableButton";
import { MuteButtonProps } from "../components/Stream/MuteButton";
import { SnapshotButtonProps } from "../components/Stream/SnapshotButton";
import { TorchButtonProps } from "../components/Stream/TorchButton";
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
        ApiRtcMuiReactLibPublishOptions?: {
            defaultProps: Pick<PublishOptionsProps, 'labelText' | 'audioAndVideoText' | 'audioOnlyText' | 'videoOnlyText'>;
        };
        ApiRtcMuiReactLibSnapshotButton?: {
            defaultProps: Pick<SnapshotButtonProps, 'snapshotTooltip'>;
        };
        ApiRtcMuiReactLibTorchButton?: {
            defaultProps: Pick<TorchButtonProps, 'torchOffTooltip' | 'torchOnTooltip'>;
        };
        ApiRtcMuiReactLibVideo?: {
            defaultProps: Pick<VideoProps, 'videoMutedTooltip'>;
        };
        ApiRtcMuiReactLibVideoEnableButton?: {
            defaultProps: Pick<VideoEnableButtonProps, 'ariaLabel' | 'enabledTooltip' | 'disabledTooltip' | 'noVideoTooltip'>;
        };
    };
}