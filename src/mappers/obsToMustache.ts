import { Observation } from "../classes/observation";
import Mustache from 'mustache';

export function obsToMustache(obs: Observation, template: string): string {
    const mustacheData: Record<string, string | boolean> = obsToJson(obs);
    return Mustache.render(template, mustacheData);
}

function obsToJson(obs: Observation): Record<string, string | boolean> {
    const res: Record<string, string | boolean> = { ...obs.components };
    
    for (const key in obs.components) {
        const value: string = obs.components[key];
        res[value] = true;
    }

    return res;
}