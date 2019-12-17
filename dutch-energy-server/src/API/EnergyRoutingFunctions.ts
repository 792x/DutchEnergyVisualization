import { Request, Response } from 'express';
import * as energyQueries from './EnergyQueries';


//Example api routing function
export async function getAnnualCityConsumption(req: Request, res: Response): Promise<void> {
    console.log('getAnnualCityConsumption called');
    //Get parameter from request, can also work with req.body.city if it was a post/put request
    let city: string = req.query.city;
    //Call a query function with the income parameter,
    let result = await energyQueries.getAnnualCityConsumption(city);
    if (result){
        //send the result with http status code and payload back to client
        res.status(200).send({annual_city_consumption: result});
    } else {
        //send the result with http status code and payload back to client
        res.status(500).send({error: "Something went wrong with getting the annual consume of city"});
    }
}