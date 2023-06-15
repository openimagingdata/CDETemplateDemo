import { DetailsList, DetailsListLayoutMode, Stack, Text } from '@fluentui/react';
import { Result } from '../utils/observation';

const StackCardStyle = {
    root: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'darkgray',
        width: '75%',
        '@media (min-width: 769px)': {
            width: '50%'
        }, 
        padding: '16px',
        marginBottom: '15px'
    }
}

const TextResultStyle = {
    root: {
        fontWeight: 'bold',
        fontSize: '25px',
        paddingBottom: '10px'
    }
}

const ResultDisplay = (result: string) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Stack styles={StackCardStyle}>
                <Text styles={TextResultStyle}>Result</Text>
                <Text styles={{root: {fontSize: '20px'}}}>{result}</Text>
            </Stack>
        </div>
    );
}

const ObservationDisplay = (data: object) => {
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
    };

    const render = (value: any) => {
        if (typeof value === 'object') {
            return ObservationDisplay(value);
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

const Display = (data: object) => {
    const result = (data as Result).result;
    const observationData = (data as Result).observation;

    return (
        <div>
           {ResultDisplay(result)}
           {observationData && ObservationDisplay(observationData)}
        </div>
    );
}

export default Display;