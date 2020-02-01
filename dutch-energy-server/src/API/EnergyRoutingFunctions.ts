import { Request, Response } from 'express';
import * as energyQueries from './EnergyQueries';

export async function getNationalData(req: Request, res: Response): Promise<void> {
    console.log('getNationalData called');
    const scope: string = req.query.scope;
    const energysource: string = req.query.energysource;


    if(energysource === 'electricity'){
        const result = await energyQueries.getNationalElectricityData(scope);
        if(result){
            res.status(200).send(result);
        } else if (result === null){
            res.status(404).send({error: "could not find any results"})
        } else {
            res.status(500).send({error: "something went wrong"})
        }
    } else {
        const result = await energyQueries.getNationalGasData(scope);
        if(result){
            res.status(200).send(result);
        } else if (result === null){
            res.status(404).send({error: "could not find any results"})
        } else {
            res.status(500).send({error: "something went wrong"})
        }
    }
}


export async function getSpecificData(req: Request, res: Response): Promise<void> {
    console.log('getSpecificData called');
    //Get parameters from request, can also work with req.body.city if it was a post/put request
    const scope: string = req.query.scope;
    const id: number = req.query.id; // wijk, buurt of gemeente id

    // console.log(scope, id, netmanager, energysource, timeframe, data);
    console.log(scope, id);

    const result = await energyQueries.getSpecificData(scope, id);
    if(result){
        res.status(200).send(result);
    } else if (result === null){
        res.status(404).send({error: "could not find any results"})
    } else {
        res.status(500).send({error: "something went wrong"})
    }
}