import Localization from '.'

export const frFR: Localization = {
    components: {
        ApiRtcMuiReactLibAudioEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver l'audio",
                enabledTooltip: "Audio activé, cliquer pour désactiver",
                disabledTooltip: "Audio désactivé, cliquer pour activer",
                noAudioTooltip: "Pas d'audio"
            }
        },
        ApiRtcMuiReactLibMuteButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver le son",
                mutedTooltip: "Son désactivé, cliquer pour activer",
                unmutedTooltip: "Son activé, cliquer pour désactiver",
                noAudioTooltip: "Pas d'audio"
            }
        },
        ApiRtcMuiReactLibPublishOptions: {
            defaultProps: {
                labelText: "Options de publication",
                audioAndVideoText: "Audio et Vidéo",
                audioOnlyText: "Audio seul",
                videoOnlyText: "Vidéo seule"
            }
        },
        ApiRtcMuiReactLibSnapshotButton: {
            defaultProps: {
                snapshotTooltip: "Prendre une photo"
            }
        },
        ApiRtcMuiReactLibTorchButton: {
            defaultProps: {
                torchOffTooltip: "Eteindre la torche",
                torchOnTooltip: "Allumer la torche"
            }
        },
        ApiRtcMuiReactLibVideo: {
            defaultProps: {
                videoMutedTooltip: "Vidéo coupée"
            }
        },
        ApiRtcMuiReactLibVideoEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver la vidéo",
                enabledTooltip: "Vidéo activée, cliquer pour désactiver",
                disabledTooltip: "Vidéo désactivée, cliquer pour activer",
                noVideoTooltip: "Pas de Vidéo"
            }
        },
    }
};