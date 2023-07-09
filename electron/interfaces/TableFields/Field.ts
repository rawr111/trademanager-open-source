import AvalibleTypes from './AvalibleFieldTypes';

interface Field {
    type: AvalibleTypes,
    isSortable: boolean,
    sortDirection?: 'UP' | 'DOWN',
    isVisible: boolean,
    title: string,
    showTtitleInTable: boolean,
    width?: 150
}

export default Field;