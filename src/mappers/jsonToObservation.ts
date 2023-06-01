import { observationSchema, ObservationData, ComponentData, SystemCodeData } from '../models/schemas';
import { Observation, Code } from '../models/observation';

export function jsonToObservation(json: object): Observation {
    if (!(observationSchema.safeParse(json).success)) {
        throw new Error("Invalid Observation JSON.");
    }
    
    const obsData: ObservationData = json as ObservationData;

    // Assume valid observation JSON after safeParse
    let observation: Observation = new Observation();

    observation.id = obsData.id;
    observation.code = codingToCode(obsData.code);
    if (obsData?.bodySite) {
        observation.bodySite = codingToCode(obsData.bodySite.code.coding[0]);
    }
    obsData.component.forEach((component: ComponentData) => addComponent(observation.components, component));

    return observation;
}

function addComponent(record: Record<string, string>, component: ComponentData): void {
    // Assume one element in coding (Only RAD is used)
    const codeKey = component.code.coding[0].code; // Required
    const displayKey1 = component.code.coding[0]?.display;
    const displayKey2 = displayKey1 ? displayKey1.toLowerCase() : undefined;
    const keys = [codeKey, displayKey1, displayKey2];

    const value = getComponentValue(component);

    keys.forEach((key) => {
        if (key) {
            record[key] = value;
        }
    });
}

function getComponentValue(component: ComponentData): string {
    if ('valueCodeableConcept' in component) {
        const codingObj = component.valueCodeableConcept.coding[0];
        return codingObj?.display ? codingObj?.display : codingObj.code;
    }
    if ('valueString' in component) {
        return component.valueString;
    }
    if ('valueInteger' in component) {
        return component.valueInteger.toString();
    }
    if ('valueFloat' in component) {
        return component.valueFloat.toString();
    }
    else {
        throw new Error("Component Value Format Not Supported.")
    }
}

function codingToCode (coding: SystemCodeData): Code {
    const code: Code = new Code();
    code.id = coding.code;
    code.display = coding?.display ? coding?.display : undefined;

    return code;
}