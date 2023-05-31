import express, { Request, Response, NextFunction } from 'express';
import { jsonToObservation } from './mappers/jsonToObservation';
import { Observation } from './models/observation';
import { obsToMustache } from './mappers/obsToMustache';

const app: express.Application = express();
const port: number = 3000;

app.use(express.json());

app.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const json = req.body;

        if (!(json?.observation && json?.template)) {
            throw new Error("Observation and mustache template are required.");
        }

        const obsJsonString: string = json.observation;
        const obsJsonObject: object = JSON.parse(obsJsonString); // Does not handle comments in JSON

        const templateString: string = json.template;

        const observation: Observation = jsonToObservation(obsJsonObject);
        const strRes: string = obsToMustache(observation, templateString);

        res.send(strRes);
    } catch (error) {
        next(error);
    }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({error: err.message});
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})