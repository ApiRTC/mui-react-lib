import Localization from '.'

export const frFR: Localization = {
    components: {
        ApiRtcMuiReactLibAudioEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver l'audio",
                enabledTooltip: "Audio activé, cliquer pour désactiver",
                disabledTooltip: "Audio désactivé, cliquer pour activer"
            }
        },
        ApiRtcMuiReactLibVideoEnableButton: {
            defaultProps: {
                ariaLabel: "activer ou désactiver la vidéo",
                enabledTooltip: "Vidéo activée, cliquer pour désactiver",
                disabledTooltip: "Vidéo désactivée, cliquer pour activer"
            }
        },
    }
};