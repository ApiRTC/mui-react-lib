import Localization from '.'

export const frFR: Localization = {
    components: {
        ApiRtcMuiReactLibAudioEnableButton: {
            defaultProps: {
                'aria-label': "activer ou désactiver l'audio",
                enabledTooltip: "Audio activé, cliquer pour désactiver",
                disabledTooltip: "Audio désactivé, cliquer pour activer",
                noAudioTooltip: "Pas d'audio"
            }
        },
        ApiRtcMuiReactLibMuteButton: {
            defaultProps: {
                'aria-label': "activer ou désactiver le son",
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
                'aria-label': "photo",
                snapshotTooltip: "Prendre une photo"
            }
        },
        ApiRtcMuiReactLibTorchButton: {
            defaultProps: {
                'aria-label': "torche",
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
                'aria-label': "activer ou désactiver la vidéo",
                enabledTooltip: "Vidéo activée, cliquer pour désactiver",
                disabledTooltip: "Vidéo désactivée, cliquer pour activer",
                noVideoTooltip: "Pas de Vidéo"
            }
        },
    }
};