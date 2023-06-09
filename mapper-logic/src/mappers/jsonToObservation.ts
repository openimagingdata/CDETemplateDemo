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

    const codeDisplay = component.code.coding[0]?.display;
    const lowerCaseKey = codeDisplay ? codeDisplay.toLowerCase() : undefined;
    const upperCaseKey = codeDisplay ? codeDisplay[0].toUpperCase() + codeDisplay.slice(1) : undefined;

    const valueDisplay: string = getComponentValue(component);
    const lowerCaseValue = valueDisplay.toLowerCase();
    const upperCaseValue = valueDisplay[0].toUpperCase() + valueDisplay.slice(1);

    record[codeKey] = lowerCaseValue;
    if (lowerCaseKey) {
        record[lowerCaseKey] = lowerCaseValue;
    }
    if (upperCaseKey) {
        record[upperCaseKey] = upperCaseValue;
    }
}

function getComponentValue(component: ComponentData): string {
    if ('valueCodeableConcept' in component) {
        const codingObj = component.valueCodeableConcept.coding[0];
        return codingObj?.display ?? codingObj.code;
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
    code.display = coding?.display ?? undefined;

    return code;
}