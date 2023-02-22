import Localization from '.'

export const frFR: Localization = {
    components: {
        ApiRtcMuiReactLibAudioEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver l'audio",
                enabledTooltip: "Audio activé, cliquer pour désactiver",
                disabledTooltip: "Audio désactivé, cliquer pour activer",
                noAudioToolTip: "Pas d'audio"
            }
        },
        ApiRtcMuiReactLibMuteButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver le son",
                mutedTooltip: "Son désactivé, cliquer pour activer",
                unmutedTooltip: "Son activé, cliquer pour désactiver",
                noAudioToolTip: "Pas d'audio"
            }
        },
        ApiRtcMuiReactLibVideoEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver la vidéo",
                enabledTooltip: "Vidéo activée, cliquer pour désactiver",
                disabledTooltip: "Vidéo désactivée, cliquer pour activer",
                noVideoToolTip: "Pas de Vidéo"
            }
        },
    }
};