import { R4 } from '@ahryman40k/ts-fhir-types';
import { either } from 'fp-ts';
import { Observation, Code } from '../models/observation';

export function jsonToObservation(json: any): Observation {
    // Change validation to use zod schema later
    // Only resourceType and code is required
    const observationValidation = R4.RTTI_Observation.decode(json);
    if (either.isLeft(observationValidation)) {
        throw new Error("R4 Observation Validation Error");
    }

    if (!(json?.id && json?.bodySite && json?.component.length)) {
        throw new Error("Id, Bodysite, and Component are required");
    }
    
    // Assume valid json object after validation
    let observation: Observation = new Observation();

    observation.id = json.id;
    observation.code = codingToCode(json.code);
    observation.bodySite = codingToCode(json.bodySite.code.coding[0]);
    json.component.forEach((component: any) => addComponent(observation.components, component));

    return observation;
}

function addComponent(record: Record<string, string>, component: any): void {
    // Assume one element in coding (Only RAD is used)
    const codeKey = component.code.coding[0].code; // Required
    const displayKey1 = component.code.coding[0]?.display;
    const displayKey2 = displayKey1 ? displayKey1.toLowerCase() : undefined;
    const keys = [codeKey, displayKey1, displayKey2];
    
    // Assume only one value type is used
    const valQuantity = component?.valueQuantity;
    const v1 = valQuantity ? `${valQuantity.value} ${valQuantity.unit}` : undefined;

    const valCodeableObj = component?.valueCodeableConcept?.coding[0];
    const v2 = valCodeableObj?.display ? valCodeableObj?.display : valCodeableObj?.code;

    const v3 = component?.valueString;
    const v4 = component?.valueBoolean;
    const v5 = component?.valueInteger;

    keys.forEach((key) => {
        if (key) {
            record[key] = v1 ?? v2 ?? v3 ?? v4 ?? v5;
        }
    });
}

function codingToCode (coding: any): Code {
    const code: Code = new Code();
    code.id = coding.code;
    code.display = coding?.display ? coding?.display : undefined;

    return code;
}