import { DetailsList, DetailsListLayoutMode, Tooltip } from '@fluentui/react';

const Display = (data: object) => {
    const render = (value: any) => {
        if (typeof value === 'object') {
            return Display(value);
        }
        return value;
    }

    const transformedData = Object.entries(data).map(([key, value]) => ({
        key: key,
        value: render(value)
        }))

    const columns = [
        {key: 'column1', name: 'Key', fieldName: 'key', minWidth: 100, maxWidth: 150, isResizeable: true},
        {key: 'column2', name: 'Value', fieldName: 'value', minWidth: 200, isResizeable: true}
    ];

    return (
        <DetailsList
            items={transformedData}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
        />
    );
}

export default Display;