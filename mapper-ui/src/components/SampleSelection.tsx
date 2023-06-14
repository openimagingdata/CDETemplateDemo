import { Dropdown, DropdownMenuItemType, IDropdownOption } from '@fluentui/react';
import { IndexSet } from '../utils/indexSet';
import jsonData from '../sample_index.json';
import React from 'react';
import axios from 'axios';
import { SampleType } from '../utils/sampleType';

interface Props {
    setText: React.Dispatch<React.SetStateAction<string>>;
    sampleType: SampleType; // 'observations' or 'templates'
}

const SampleSelection: React.FC<Props> = ({ setText, sampleType }) => {
    const [sample, setSample] = React.useState<string>();

    const typeObservation: boolean = sampleType === 'observations';
    const typeTemplate: boolean = sampleType === 'templates';

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        if (typeObservation) {
            setText(JSON.stringify(sample, null, 4));
        }
        if (typeTemplate) {
            setText(sample as string);
        }
    }, [sample]);

    const sets = jsonData;

    const dropdownOptions: IDropdownOption[] = [];

    const addSample = (sample: string) => {
        const array = sample.split('/');
        const sampleDir = `../sample_${sampleType}/${array[array.length - 2]}/${array[array.length - 1]}`
        const sampleName = array[array.length - 1];

        dropdownOptions.push({key: sampleDir, text: (sampleName[0].toUpperCase() + sampleName.slice(1))})
    };

    const addSet = (set: IndexSet) => {
        let samples: any[] = [];
        if (typeObservation) {
            samples = set.samples;
        }
        if (typeTemplate) {
            samples = set.templates;
        }

        if (samples.length === 0) {
            return;
        }

        const headerName = `${set.name} (${set.cdeId})`;
        dropdownOptions.push({key: set.cdeId, text: headerName, itemType: DropdownMenuItemType.Header});
        
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

    let dropdownPlaceholder = '';
    if (typeObservation) {
        dropdownPlaceholder = "Select an observation";
    }
    if (typeTemplate) {
        dropdownPlaceholder = "Select a template";
    }

    return (<Dropdown
            placeholder={dropdownPlaceholder}
            label={`Sample ${sampleType[0].toUpperCase() + sampleType.slice(1)}`}
            options={dropdownOptions}
            onChange={(event, item) => handleDropdown(item)}
            styles={{dropdown: {width: 300}}}
            />);
};

export default SampleSelection