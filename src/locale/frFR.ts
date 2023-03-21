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