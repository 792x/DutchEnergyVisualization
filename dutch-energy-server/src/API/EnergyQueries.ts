import {Electricity} from '../models/Models'

//Example api query function
export async function getAnnualCityConsumption(city: string): Promise<Boolean | number>{

    //Sequelize syntax/promise chain after we import the model
    let result = await Electricity.sum(
        'annual_consume', {
        where: {
            city: city
        }
    })
    .then((sum) => {
        return sum;
    })
    .catch((err) => {
        console.log('getAnnualConsumeOfPostcode', err);
        return false;
    });
    return result;

}