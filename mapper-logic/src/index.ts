import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { jsonToObservation } from './mappers/jsonToObservation';
import { Observation } from './models/observation';
import { obsToMustache } from './mappers/obsToMustache';
import { Result } from './models/result';

const app: express.Application = express();
const port: number = 8000;
const route: string = '/api/obs-template';
const frontendPath: string = '../../mapper-ui/build';

app.use(express.static(path.join(__dirname, frontendPath)));

app.use(express.json());

app.post(route, (req: Request, res: Response, next: NextFunction) => {
    try {
        const json = req.body;

        if (!(json?.observation && json?.template)) {
            throw new Error("Observation and Mustache Template are Required.");
        }

        const obsJsonString: string = json.observation;

        const obsJsonObject: object = JSON.parse(obsJsonString); // Does not handle comments in JSON

        const templateString: string = json.template;

        const observation: Observation = jsonToObservation(obsJsonObject);
        const strRes: string = obsToMustache(observation, templateString);

        let result: Result = new Result();

        result.result = strRes;
        if (json?.object === true) {
            result.observation = observation;
        }

        res.send(result);
    } catch (error) {
        next(error);
    }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({error: err.message});
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, frontendPath, 'index.html'))
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})