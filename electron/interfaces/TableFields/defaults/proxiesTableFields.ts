import AvalibleTypes from "../AvalibleFieldTypes";
import Field from "../Field";

const proxiesTableFields: Field[] = [
    {
        type: AvalibleTypes.number,
        title: "№",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.proxyHost,
        title: "Хост прокси",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.proxyPort,
        title: "Порт прокси",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.proxyUsername,
        title: "Логин прокси",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.proxyPassword,
        title: "Пароль прокси",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.linkedSteamAccounts,
        title: "Подключенные аккаунты Steam",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.linkedProfiles,
        title: "Подключенные профили",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleTypes.testProxyButton,
        title: "Кнопка для тестирования",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false
    }
];

export default proxiesTableFields;