export class Observation {
    id!: string;
    code!: Code;
    bodySite!: Code;
    components: Record<string, string> = {};
}

export class Code {
    id!: string;
    display: string | undefined; 
}