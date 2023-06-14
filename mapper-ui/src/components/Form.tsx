import { Stack, TextField, Toggle, PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import axios, { AxiosError } from 'axios';
import React from 'react';
import Result from './Result';
import SampleSelection from './SampleSelection';

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

const Form = () => {
    const [observation, setObservation] = React.useState<string>('');
    const [template, setTemplate] = React.useState<string>('');
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
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
            <form onSubmit={handleSubmit} style={{paddingTop: '20px', paddingBottom: '20px'}}>
                <Stack tokens={{childrenGap: 15}} horizontalAlign="center">
                    <SampleSelection setText={setObservation} sampleType={'observations'} />
                    <TextField 
                        label="Observation JSON" value={observation}
                        onChange={(event, newValue) => setObservation(newValue ?? '')}
                        styles={textFieldStyles} multiline autoAdjustHeight
                    />

                    <SampleSelection setText={setTemplate} sampleType={'templates'} />
                    <TextField
                        label="Mustache Template" value={template} 
                        onChange={(event, newValue) => setTemplate(newValue ?? '')} 
                        styles={textFieldStyles} multiline autoAdjustHeight 
                    />

                    <Toggle
                        label="Return Observation Structure Object"
                        onText="True" offText="False" checked={objBool}
                        onChange={(event, newValue) => setObjBool(newValue ?? false)}
                        inlineLabel
                    />

                    <PrimaryButton 
                        type="submit" text="Submit"
                    />
                </Stack>
            </form>
            {Object.keys(result).length !== 0 && (
                Result(result)
            )}
        </div>
    );
};

export default Form;