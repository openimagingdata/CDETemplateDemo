import { Observation } from "../models/observation";
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
        if (key.toLowerCase() === "presence") {
            if (value.toLowerCase() === "present") {
                res["presence_present"] = true;
                res["presence_absent"] = false;
            } else {
                res["presence_present"] = false;
                res["presence_absent"] = true;
            }
        }
    }

    return res;
}