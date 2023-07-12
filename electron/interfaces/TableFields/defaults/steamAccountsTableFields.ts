import AvalibleFieldTypes from "../AvalibleFieldTypes";
import Field from "../Field";

const steamAccountsTableFields: Field[] = [
    {
        type: AvalibleFieldTypes.checkbox,
        title: "Выделение аккаунта",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false,
        width: 50
    },
    {
        type: AvalibleFieldTypes.number,
        title: "№",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 50
    },
    {
        type: AvalibleFieldTypes.startButton,
        title: "Кнопка запуска браузера",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false,
        width: 100
    },
    {
        type: AvalibleFieldTypes.steamAccountAvatar,
        title: "Аватар Steam",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false,
        width: 60
    },
    {
        type: AvalibleFieldTypes.steamGuard,
        title: "Guard код",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false,
        width: 110
    },
    {
        type: AvalibleFieldTypes.steamAccountButtons,
        title: "Функционал Guard",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false,
        width: 170
    },
    {
        type: AvalibleFieldTypes.steamAccountLevel,
        title: "lvl",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 60
    },
    {
        type: AvalibleFieldTypes.steamAccountName,
        title: "Логин Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 130
    },
    {
        type: AvalibleFieldTypes.steamAccountBalance,
        title: "Баланс Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 130
    },
    {
        type: AvalibleFieldTypes.steamPassword,
        title: "Пароль Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 140
    },

    {
        type: AvalibleFieldTypes.csgoTmBalance,
        title: "Баланс CSGO TM",
        isSortable: true,
        isVisible: false,
        showTtitleInTable: true,
        width: 150
    },

    {
        type: AvalibleFieldTypes.ktState,
        title: "Статус КТ",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 50
    },
    {
        type: AvalibleFieldTypes.tpState,
        title: "Статус ТП",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 50
    },
    {
        type: AvalibleFieldTypes.tradeState,
        title: "Статус обменов",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true,
        width: 50
    },

    {
        type: AvalibleFieldTypes.steamAccountNickname,
        title: "Ник Steam",
        isSortable: true,
        isVisible: false,
        showTtitleInTable: true,
        width: 50
    },
    {
        type: AvalibleFieldTypes.tmApiKey,
        title: "TM api",
        isSortable: true,
        isVisible: false,
        showTtitleInTable: true,
        width: 100
    },
    {
        type: AvalibleFieldTypes.mail,
        title: "Почта",
        isSortable: true,
        isVisible: false,
        showTtitleInTable: true,
        width: 100
    },
    {
        type: AvalibleFieldTypes.mailPassword,
        title: "Почта (пароль)",
        isSortable: false,
        isVisible: false,
        showTtitleInTable: true,
        width: 150
    },
    {
        type: AvalibleFieldTypes.linkedProxies,
        title: "Подключенный прокси",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: true,
        width: 200
    },
    {
        type: AvalibleFieldTypes.accountTools,
        title: "Экспорт, удаление, редактирование",
        isSortable: false,
        isVisible: false,
        showTtitleInTable: false,
        width: 130
    }
];

export default steamAccountsTableFields;