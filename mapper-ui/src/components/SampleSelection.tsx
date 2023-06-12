import { Dropdown, DropdownMenuItemType, IDropdownOption } from '@fluentui/react';
import { IndexSet } from '../utils/indexSet';
import jsonData from '../observation_index.json';
import React from 'react';
import axios from 'axios';

interface Props {
    setText: React.Dispatch<React.SetStateAction<string>>;
}

const SampleSelection: React.FC<Props> = ({ setText }) => {
    const [sample, setSample] = React.useState({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        setText(JSON.stringify(sample, null, 4))
    }, [sample])

    const sets = jsonData;

    const dropdownOptions: IDropdownOption[] = [];

    const addSample = (sample: string) => {
        const array = sample.split('/');
        const sampleDir = `../sample_observations/${array[array.length - 2]}/${array[array.length - 1]}`
        const sampleName = array[array.length - 1];

        dropdownOptions.push({key: sampleDir, text: (sampleName[0].toUpperCase() + sampleName.slice(1))})
    };

    const addSet = (set: IndexSet) => {
        const headerName = `${set.name} (${set.cdeId})`;
        dropdownOptions.push({key: set.cdeId, text: headerName, itemType: DropdownMenuItemType.Header});

        const samples = set.samples;
        samples.forEach((sample) => addSample(sample))
    };

    sets.forEach((set: IndexSet) => {
        addSet(set);
    });

    const handleDropdown = async (item: IDropdownOption<any> | undefined) => {
        if (item) {
            try {
                const response = await axios.get(item.key as string);
                setSample(() => response.data);
            } catch (error) {
                console.log('Error fetching sample:', error);
            }
        }
    };

    return (<Dropdown
            placeholder="Select an observation"
            label="Observation Examples"
            options={dropdownOptions}
            onChange={(event, item) => handleDropdown(item)}
            styles={{dropdown: {width: 300}}}
            />);
};

export default SampleSelection