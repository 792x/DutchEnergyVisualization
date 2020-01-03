import { Request, Response } from 'express';
import * as energyQueries from './EnergyQueries';


//Example api routing function
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
            res.status(200).send({message: "success"});
        }
    } else {

    }


    res.status(200).send();

    // //Call a query function with the income parameter,
    // let result = await energyQueries.getAnnualCityConsumption(city);
    // if (result){
    //     //send the result with http status code and payload back to client
    //     res.status(200).send({annual_city_consumption: result});
    // } else {
    //     //send the result with http status code and payload back to client
    //     res.status(500).send({error: "Something went wrong with getting the annual consume of city"});
    // }
}