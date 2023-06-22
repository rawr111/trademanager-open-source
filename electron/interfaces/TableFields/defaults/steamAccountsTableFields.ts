import AvalibleFieldTypes from "../AvalibleFieldTypes";
import Field from "../Field";

const steamAccountsTableFields: Field[] = [
    {
        type: AvalibleFieldTypes.number,
        title: "№",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.tmApiKey,
        title: "TM api",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.mail,
        title: "Почта",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.mailPassword,
        title: "Почта (пароль)",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.startButton,
        title: "Кнопка запуска браузера",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false
    },
    {
        type: AvalibleFieldTypes.steamAccountNickname,
        title: "Ник Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.csgoTmBalance,
        title: "Баланс CSGO TM",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.ktState,
        title: "Статус КТ",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.tpState,
        title: "Статус ТП",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.tradeState,
        title: "Статус обменов",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.steamAccountAvatar,
        title: "Аватар Steam",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false
    },
    {
        type: AvalibleFieldTypes.steamGuard,
        title: "Guard код",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false
    },
    {
        type: AvalibleFieldTypes.steamAccountButtons,
        title: "Функционал Guard",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: false
    },
    {
        type: AvalibleFieldTypes.steamAccountLevel,
        title: "lvl",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.steamAccountName,
        title: "Логин Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.steamAccountBalance,
        title: "Баланс Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.steamPassword,
        title: "Пароль Steam",
        isSortable: true,
        isVisible: true,
        showTtitleInTable: true
    },
    {
        type: AvalibleFieldTypes.linkedProxies,
        title: "Подключенный прокси",
        isSortable: false,
        isVisible: true,
        showTtitleInTable: true
    }
];

export default steamAccountsTableFields;