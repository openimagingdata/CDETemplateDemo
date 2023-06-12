// Declared both in frontend and backend, change later?

export class Result {
    result!: string;
    observation?: Observation;
}

export class Observation {
    id!: string;
    code!: Code;
    bodySite: Code | undefined = undefined;
    components: Record<string, string> = {};
}

export class Code {
    id!: string;
    display: string | undefined; 
}