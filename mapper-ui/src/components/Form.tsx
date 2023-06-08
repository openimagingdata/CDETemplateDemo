import { Stack, TextField, Toggle, PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import axios, { AxiosError } from 'axios';
import React from 'react';
import Result from './Result';

const textFieldStyles = {
    root: {
        width: '100%',
        '@media (min-width: 481px)': {
            width: '75%'
        },
        '@media (min-width: 769px)': {
            width: '50%'
        }
    }
};

// const testData = {
//     result: " 42.595, 20.658, 59.874, 20.658 coordinates.  ",
//     observation: {
//         bodySite: {
//             id: "RID2035",
//             display: "ulnar collateral ligament of elbow"
//         },
//         components: {
//             RDE256: "full-thickness tear",
//             Classification: "full-thickness tear",
//             classification: "full-thickness tear",
//             RDE257: "abnormal",
//         },
//         id: "28d99870-ace5-46bd-8742-1d9a6d1796fc",
//         code: {
//             id: "RDES47",
//             display: "Stener Lesion"
//         }
//     }
// }

const Form = () => {
    const [observation, setObservation] = React.useState('');
    const [template, setTemplate] = React.useState('');
    const [objBool, setObjBool] = React.useState(false);
    const [result, setResult] = React.useState({});
    const [error, setError] = React.useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        setResult({});
        setError('');

        const url = '/api/obs-template';
        const input = {
            observation: observation.replace(/\\/g, ''),
            template: template,
            object: objBool
        };
        
        try {
            const response = await axios.post(url, input);

            setResult(response.data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                
                if (axiosError.response) {
                    console.error(axiosError.response)
                    const errorData = axiosError.response.data as {error: string}
                    setError(errorData.error)
                }
                else if (axiosError.request) {
                    console.error(axiosError.request)
                }
                else {
                    console.error(axiosError.message)

                }
            } else {
                console.error(error)
            }
        }
    };

    return (
        <div>
            {error &&
                <div >
                    <MessageBar
                    messageBarType={MessageBarType.error}
                    >{error}</MessageBar>
                </div>}
            <form onSubmit={handleSubmit} style={{paddingTop: '20px'}}>
                <Stack tokens={{childrenGap: 15}} horizontalAlign="center">
                    <TextField 
                        label="Observation JSON String" value={observation}
                        onChange={(event, newValue) => setObservation(newValue ?? '')}
                        styles={textFieldStyles} multiline autoAdjustHeight
                    />

                    <TextField
                        label="Mustache Template String" value={template} 
                        onChange={(event, newValue) => setTemplate(newValue ?? '')} 
                        styles={textFieldStyles} multiline autoAdjustHeight 
                        />

                    <Toggle
                        label="Return Observation Structure Object"
                        onText="True" offText="False" checked={objBool}
                        onChange={(event, newValue) => setObjBool(newValue ?? false)}
                        inlineLabel
                    />

                    <PrimaryButton type="submit" text="Submit"/>
                </Stack>
            </form>
            {Object.keys(result).length !== 0 && (
                Result(result)
            )}
        </div>
    );
};

export default Form;