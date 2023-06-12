import { DetailsList, DetailsListLayoutMode } from '@fluentui/react';

const Display = (data: object) => {

    const outputValue = (value: string) => {
        const regexRDES = /^RDES\d+/;
        const regexRDE = /^RDE\d+/;

        // Check RDES
        if (regexRDES.test(value)) {
            const url: string = `https://radelement.org/home/sets/set/${value}`;
            return <a href={url}>{value}</a>
        }
        // Check RDE
        if (regexRDE.test(value)) {
            const url: string = `https://radelement.org/home/sets/element/${value}`;
            return <a href={url}>{value}</a>;
        }
    
        return value;
    }

    const render = (value: any) => {
        if (typeof value === 'object') {
            return Display(value);
        }
        return outputValue(value);
    };

    const transformedData = Object.entries(data).map(([key, value]) => ({
        key: outputValue(key),
        value: render(value)
        }));

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