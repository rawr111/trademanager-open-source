import AvalibleTypes from './AvalibleFieldTypes';

interface Field {
    type: AvalibleTypes,
    isSortable: boolean,
    sortDirection?: 'UP' | 'DOWN',
    isVisible: boolean,
    title: string,
    showTtitleInTable: boolean,
    width?: number
}

export default Field;