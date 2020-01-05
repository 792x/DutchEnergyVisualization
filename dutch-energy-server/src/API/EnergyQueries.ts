import {Electricity, Gas} from '../models/Models'
import {Op} from "sequelize";

export async function getNationalElectricityData(scope:string, netmanager:string, timeframe:number, data:number){
    //check how we should build the response based on scope
    //return json with buurtnummer as index

    //TODO AGGREGATE for buurt, wijk or gemeente
    
    let result:any = {};

    const rows = await Electricity.findAll({
        where: {
            net_manager:{
                [Op.like]: await handleNetManager(netmanager)
            },
            year: await handleTimeframe(timeframe)
        },
        raw: true //raw because huge dataset (see sequelize model usage docs)
    })
    // console.log(rows);

    //build our response by aggregating results in teh same scope (i.e. all entries of the same gemeente if scope is gemeente)

    
    if(rows){
        if(rows.length > 0){
            for (const row of rows){
                let params:any = {};
                params.id = row.id;
                params.city = row.city;
                params.gemeente2019 = row.gemeente2019;
                params.gemeentenaam2019 = row.gemeentenaam2019;

                if(row.buurt2019 && row.gemeente2019 && row.wijk2019){
                    switch(scope){
                        case 'buurt':
                            params.buurt2019 = row.buurt2019;
                            params.buurtnaam2019 = row.buurtnaam2019;
                            params.wijk2019 = row.wijk2019;
                            params.wijknaam2019 = row.wijknaam2019;
                            //return json with buurtnummer as index
                            if(result[row.buurt2019]){
                                //TODO :already have an entry for this buurtnumber so we merge it
                                result[row.buurt2019] = params;
                                
                            } else {
                                //first time seeing this buurtnumber
                                result[row.buurt2019] = params;
                            }
                            break;
                        case 'wijk':
                            params.wijk2019 = row.wijk2019;
                            params.wijknaam2019 = row.wijknaam2019;
                            //return json with wijknummer as index
                            if(result[row.wijk2019]){
                                //TODO :already have an entry for this wijknumber so we merge it
                                result[row.wijk2019] = params;
                                
                            } else {
                                //first time seeing this buurtnumber
                                result[row.wijk2019] = params;
                            }
                            break;
                        case 'gemeente':
                            //return json with gemeentenummer as index
                            if(result[row.gemeente2019]){
                                //TODO :already have an entry for this gemeentenummer so we merge it
                                result[row.gemeente2019] = params;
                                
                            } else {
                                //first time seeing this buurtnumber
                                result[row.gemeente2019] = params;
                            }
                            break;
                    }
                }
            }
            console.log(result);
            return result;
        } else {
            return null;
        }
    } else {
        return false;
    }
}

export async function getNationalGasData(scope:string, netmanager:string, timeframe:number, data:number){
    //TODO
}



function handleData(data:number){
    // <option value={1}>Energy consumption</option>
    // <option value={2}>Energy low tarif consumption</option>
    // <option value={3}>Percentage of smartmeters</option>
    // <option value={4}>Number of connections</option>
    // <option value={5}>Percentage of active connections</option>
    // <option value={6}>Delivery percentage</option>

    // TODO: resolve numbers to what data aggregation stuff we need to do, then precalculate coloring values (standardized between 1-100 maybe?) and add to return response

}

async function handleNetManager(netmanager:string){
    switch(netmanager){
        case 'all':
            return '%';
        case 'stendin':
            // 8716924000003
            // 8716925000002
            // 8716946000005
            // 8716874000009
            // 8716886000004
            // 8716921000006
            // 8716892000005
            return '8716%';
        case 'liander':
            // Liander N.V.
            // Liander N.V. (ZW)
            // Liander N.V. (NW)
            return 'Liander%';
        case 'enexis':
            // Enexis
            // Enexis B.V.
            return 'Enexis%';
    }
}

async function handleTimeframe(timeframe:number){
    // <option value={1}>2019</option>
    // <option value={2}>2018</option>
    // <option value={3}>2017</option>
    // <option value={4}>2016</option>
    // <option value={5}>2015</option>
    // <option value={6}>2014</option>
    // <option value={7}>2013</option>
    // <option value={8}>2012</option>
    // <option value={9}>2011</option>
    // <option value={10}>2010</option>
    // <option value={11}>Last two years</option>
    // <option value={12}>Last three years</option>
    // <option value={13}>Last five years</option>
    // <option value={14}>All data</option>

    console.log('input timeframe', timeframe);

    switch(+timeframe){
        case 1:
            return [2019];
        case 2:
            return [2018];
        case 3:
            return [2017];
        case 4:
            return [2016];
        case 5:
            return [2015];
        case 6:
            return [2014];
        case 7:
            return [2013];
        case 8:
            return [2012];
        case 9:
            return [2011];
        case 10:
            return [2010];
        case 11:
            return [2019, 2018];
        case 12:
            return [2019, 2018, 2017];
        case 13:
            return [2019, 2018, 2017, 2016, 2015];
        case 14:
            return [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];
        default:
            return [0]
    }
}