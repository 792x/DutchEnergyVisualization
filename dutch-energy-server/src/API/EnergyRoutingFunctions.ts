import { Request, Response } from 'express';
import * as energyQueries from './EnergyQueries';

export async function getNationalData(req: Request, res: Response): Promise<void> {
    console.log('getNationalData called');
    //Get parameters from request, can also work with req.body.city if it was a post/put request
    const scope: string = req.query.scope;
    const netmanager: string = req.query.netmanager;
    const energysource: string = req.query.energysource;
    const timeframe: number = req.query.timeframe;
    const data: number = req.query.data;

    console.log(scope, netmanager, energysource, timeframe, data);

    //first check what table we should query
    if(energysource === 'electricity'){
        const result = await energyQueries.getNationalElectricityData(scope, netmanager, timeframe, data)
        if(result){
            res.status(200).send(result);
        } else if (result === null){
            res.status(404).send({error: "could not find any results"})
        } else {
            res.status(500).send({error: "something went wrong"})
        }
    } else {

    }


    /**
     * stuur alleen data terug die zichtbaar is in json:
     * 
     * gem/wijk/buurt nr. als index
     * een relatieve color value die we hebben berekend hier op server side
     * zichtbare info zoals gemeente naam, buurt naam, wijk naam
     * 
     */


    res.status(200).send();
}

export async function getSpecificData(req: Request, res: Response): Promise<void> {
    console.log('getSpecificData called');
    //Get parameters from request, can also work with req.body.city if it was a post/put request
    const scope: string = req.query.scope;
    const id: number = req.query.id; //wijk, buurt of gemeente nummer
    // const netmanager: string = req.query.netmanager;
    // const energysource: string = req.query.energysource;
    // const timeframe: number = req.query.timeframe;
    // const data: number = req.query.data;

    // console.log(scope, id, netmanager, energysource, timeframe, data);
    console.log(scope, id);

    const result = await energyQueries.getSpecificElectricityData(scope, id);
    if(result){
        res.status(200).send(result);
    } else if (result === null){
        res.status(404).send({error: "could not find any results"})
    } else {
        res.status(500).send({error: "something went wrong"})
    }

    //TODO gas data

    /**
     * stuur alle nuttige data terug aangezien het klein is voor maar 1 wijk/buurt/gemeente, eventueel ook timeframe negeren en gewoon alle jaren meesturen en client side handelen
     * 
     */


    res.status(200).send();
}