import {Electricity, Gas} from '../models/Models'
import {Op, fn, col, literal} from "sequelize";

export async function getNationalGasData(scope: string){
    let gas: any;
    let values: any =  [];
    let data:any = [];
    let annual_consume_max:number;
    let num_connections_max:number; 
    let annual_consume_low_tarif_max :number;
    let delivery_perc_max:number;
    let smartmeter_perc_max :number;
    let perc_of_active_connections_max :number;
    let annual_consume_min :number;
    let num_connections_min :number;
    let annual_consume_low_tarif_min :number;
    let delivery_perc_min :number;
    let smartmeter_perc_min:number;
    let perc_of_active_connections_min :number;

    let legend: any = {};
    
    switch(scope){
        case 'buurt':
            //return json with buurtnummer as index
            gas = await Gas.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019','buurt2019', 'buurtnaam2019', 'city', 'year'],
                raw: true,
            });

            gas.reduce((res:any, val:any) => {
                if (!res[`${val.buurt2019}_${val.year}`]) {
                    res[`${val.buurt2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        wijk2019: val.wijk2019,
                        wijknaam2019: val.wijknaam2019,
                        buurt2019: val.buurt2019,
                        buurtnaam2019: val.buurtnaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.buurt2019}_${val.year}`]);
                }

                res[`${val.buurt2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.buurt2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.buurt2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.buurt2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.buurt2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.buurt2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.buurt2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.buurt2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.buurt2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
        
            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.buurt2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    wijk2019: val.wijk2019,
                    wijknaam2019: val.wijknaam2019,
                    buurt2019: val.buurt2019,
                    buurtnaam2019: val.buurtnaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.buurt2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
        case 'wijk':
            //return json with wijknummer as index
            gas = await Gas.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'city', 'year'],
                raw: true,
            });
        
            gas.reduce((res:any, val:any) => {
                if (!res[`${val.wijk2019}_${val.year}`]) {
                    res[`${val.wijk2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        wijk2019: val.wijk2019,
                        wijknaam2019: val.wijknaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.wijk2019}_${val.year}`]);
                }

                res[`${val.wijk2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.wijk2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.wijk2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.wijk2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.wijk2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.wijk2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.wijk2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.wijk2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.wijk2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));

            legend.annual_consume_max = Math.floor(annual_consume_max);
            legend.num_connections_max = Math.floor(num_connections_max);
            legend.annual_consume_low_tarif_max = Math.floor(annual_consume_low_tarif_max);
            legend.delivery_perc_max = Math.floor(delivery_perc_max);
            legend.smartmeter_perc_max = Math.floor(smartmeter_perc_max);
            legend.perc_of_active_connections_max = Math.floor(perc_of_active_connections_max);
            legend.annual_consume_min = Math.floor(annual_consume_min);
            legend.num_connections_min = Math.floor(num_connections_min);
            legend.annual_consume_low_tarif_min = Math.floor(annual_consume_low_tarif_min);
            legend.delivery_perc_min = Math.floor(delivery_perc_min);
            legend.smartmeter_perc_min = Math.floor(smartmeter_perc_min);
            legend.perc_of_active_connections_min = Math.floor(perc_of_active_connections_min);
        
            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.wijk2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    wijk2019: val.wijk2019,
                    wijknaam2019: val.wijknaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.wijk2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
        case 'gemeente':
            //return json with gemeentenummer as index
            gas = await Gas.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'city', 'year'],
                raw: true,
            });
            
            gas.reduce((res:any, val:any) => {
                if (!res[`${val.gemeente2019}_${val.year}`]) {
                    res[`${val.gemeente2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.gemeente2019}_${val.year}`]);
                }

                res[`${val.gemeente2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.gemeente2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.gemeente2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.gemeente2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.gemeente2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.gemeente2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.gemeente2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.gemeente2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.gemeente2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));

            legend.annual_consume_max = Math.floor(annual_consume_max);
            legend.num_connections_max = Math.floor(num_connections_max);
            legend.annual_consume_low_tarif_max = Math.floor(annual_consume_low_tarif_max);
            legend.delivery_perc_max = Math.floor(delivery_perc_max);
            legend.smartmeter_perc_max = Math.floor(smartmeter_perc_max);
            legend.perc_of_active_connections_max = Math.floor(perc_of_active_connections_max);
            legend.annual_consume_min = Math.floor(annual_consume_min);
            legend.num_connections_min = Math.floor(num_connections_min);
            legend.annual_consume_low_tarif_min = Math.floor(annual_consume_low_tarif_min);
            legend.delivery_perc_min = Math.floor(delivery_perc_min);
            legend.smartmeter_perc_min = Math.floor(smartmeter_perc_min);
            legend.perc_of_active_connections_min = Math.floor(perc_of_active_connections_min);
        
            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.gemeente2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.gemeente2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
    }
}

export async function getNationalElectricityData(scope: string){
    let elec: any;
    let values: any =  [];
    let data:any = [];
    let annual_consume_max:number;
    let num_connections_max:number; 
    let annual_consume_low_tarif_max :number;
    let delivery_perc_max:number;
    let smartmeter_perc_max :number;
    let perc_of_active_connections_max :number;
    let annual_consume_min :number;
    let num_connections_min :number;
    let annual_consume_low_tarif_min :number;
    let delivery_perc_min :number;
    let smartmeter_perc_min:number;
    let perc_of_active_connections_min :number;
    
    let legend: any = {};

    switch(scope){
        case 'buurt':
            //return json with buurtnummer as index
            elec = await Electricity.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019','buurt2019', 'buurtnaam2019', 'city', 'year'],
                raw: true,
            });

            elec.reduce((res:any, val:any) => {
                if (!res[`${val.buurt2019}_${val.year}`]) {
                    res[`${val.buurt2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        wijk2019: val.wijk2019,
                        wijknaam2019: val.wijknaam2019,
                        buurt2019: val.buurt2019,
                        buurtnaam2019: val.buurtnaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.buurt2019}_${val.year}`]);
                }

                res[`${val.buurt2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.buurt2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.buurt2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.buurt2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.buurt2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.buurt2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.buurt2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.buurt2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.buurt2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
        
            legend.annual_consume_max = Math.floor(annual_consume_max);
            legend.num_connections_max = Math.floor(num_connections_max);
            legend.annual_consume_low_tarif_max = Math.floor(annual_consume_low_tarif_max);
            legend.delivery_perc_max = Math.floor(delivery_perc_max);
            legend.smartmeter_perc_max = Math.floor(smartmeter_perc_max);
            legend.perc_of_active_connections_max = Math.floor(perc_of_active_connections_max);
            legend.annual_consume_min = Math.floor(annual_consume_min);
            legend.num_connections_min = Math.floor(num_connections_min);
            legend.annual_consume_low_tarif_min = Math.floor(annual_consume_low_tarif_min);
            legend.delivery_perc_min = Math.floor(delivery_perc_min);
            legend.smartmeter_perc_min = Math.floor(smartmeter_perc_min);
            legend.perc_of_active_connections_min = Math.floor(perc_of_active_connections_min);

            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.buurt2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    wijk2019: val.wijk2019,
                    wijknaam2019: val.wijknaam2019,
                    buurt2019: val.buurt2019,
                    buurtnaam2019: val.buurtnaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.buurt2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
        case 'wijk':
            //return json with wijknummer as index
            elec = await Electricity.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'city', 'year'],
                raw: true,
            });
        
            elec.reduce((res:any, val:any) => {
                if (!res[`${val.wijk2019}_${val.year}`]) {
                    res[`${val.wijk2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        wijk2019: val.wijk2019,
                        wijknaam2019: val.wijknaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.wijk2019}_${val.year}`]);
                }

                res[`${val.wijk2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.wijk2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.wijk2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.wijk2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.wijk2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.wijk2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.wijk2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.wijk2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.wijk2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));

            legend.annual_consume_max = Math.floor(annual_consume_max);
            legend.num_connections_max = Math.floor(num_connections_max);
            legend.annual_consume_low_tarif_max = Math.floor(annual_consume_low_tarif_max);
            legend.delivery_perc_max = Math.floor(delivery_perc_max);
            legend.smartmeter_perc_max = Math.floor(smartmeter_perc_max);
            legend.perc_of_active_connections_max = Math.floor(perc_of_active_connections_max);
            legend.annual_consume_min = Math.floor(annual_consume_min);
            legend.num_connections_min = Math.floor(num_connections_min);
            legend.annual_consume_low_tarif_min = Math.floor(annual_consume_low_tarif_min);
            legend.delivery_perc_min = Math.floor(delivery_perc_min);
            legend.smartmeter_perc_min = Math.floor(smartmeter_perc_min);
            legend.perc_of_active_connections_min = Math.floor(perc_of_active_connections_min);

        
            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.wijk2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    wijk2019: val.wijk2019,
                    wijknaam2019: val.wijknaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.wijk2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
        case 'gemeente':
            //return json with gemeentenummer as index
            elec = await Electricity.findAll({
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'city',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'city', 'year'],
                raw: true,
            });
            
            elec.reduce((res:any, val:any) => {
                if (!res[`${val.gemeente2019}_${val.year}`]) {
                    res[`${val.gemeente2019}_${val.year}`] = {
                        gemeente2019: val.gemeente2019,
                        gemeentenaam2019: val.gemeentenaam2019,
                        net_manager: val.net_manager,
                        year: val.year,
                        annual_consume: 0,
                        annual_consume_low_tarif: 0,
                        num_connections: 0,
                        delivery_perc_count: 0,
                        delivery_perc: 0,
                        perc_of_active_connections_count: 0,
                        perc_of_active_connections: 0,
                        smartmeter_perc_count: 0,
                        smartmeter_perc: 0,
                    };
                    data.push(res[`${val.gemeente2019}_${val.year}`]);
                }

                res[`${val.gemeente2019}_${val.year}`].annual_consume += parseFloat(val.annual_consume);
                res[`${val.gemeente2019}_${val.year}`].num_connections += parseFloat(val.num_connections);
                res[`${val.gemeente2019}_${val.year}`].annual_consume_low_tarif += (parseFloat(val.annual_consume) * (parseFloat(val.annual_consume_lowtarif_perc)/100));
                res[`${val.gemeente2019}_${val.year}`].delivery_perc += parseFloat(val.delivery_perc);
                res[`${val.gemeente2019}_${val.year}`].smartmeter_perc += parseFloat(val.smartmeter_perc);
                res[`${val.gemeente2019}_${val.year}`].perc_of_active_connections += parseFloat(val.perc_of_active_connections);
                res[`${val.gemeente2019}_${val.year}`].delivery_perc_count += 1;
                res[`${val.gemeente2019}_${val.year}`].smartmeter_perc_count += 1;
                res[`${val.gemeente2019}_${val.year}`].perc_of_active_connections_count += 1;
                
                return res;
            }, {});

            // Get max values
            annual_consume_max =Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_max = Math.max.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_max =Math.max.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_max = Math.max.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_max = Math.max.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
            annual_consume_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume; }));
            num_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.num_connections; }));
            annual_consume_low_tarif_min = Math.min.apply(Math, data.map(function(d:any) { return d.annual_consume_low_tarif; }));
            delivery_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.delivery_perc/d.delivery_perc_count; }));
            smartmeter_perc_min = Math.min.apply(Math, data.map(function(d:any) { return d.smartmeter_perc/d.smartmeter_perc_count; }));
            perc_of_active_connections_min = Math.min.apply(Math, data.map(function(d:any) { return d.perc_of_active_connections/d.perc_of_active_connections_count; }));
        
            legend.annual_consume_max = Math.floor(annual_consume_max);
            legend.num_connections_max = Math.floor(num_connections_max);
            legend.annual_consume_low_tarif_max = Math.floor(annual_consume_low_tarif_max);
            legend.delivery_perc_max = Math.floor(delivery_perc_max);
            legend.smartmeter_perc_max = Math.floor(smartmeter_perc_max);
            legend.perc_of_active_connections_max = Math.floor(perc_of_active_connections_max);
            legend.annual_consume_min = Math.floor(annual_consume_min);
            legend.num_connections_min = Math.floor(num_connections_min);
            legend.annual_consume_low_tarif_min = Math.floor(annual_consume_low_tarif_min);
            legend.delivery_perc_min = Math.floor(delivery_perc_min);
            legend.smartmeter_perc_min = Math.floor(smartmeter_perc_min);
            legend.perc_of_active_connections_min = Math.floor(perc_of_active_connections_min);

            // Map values to range (0, 100)
            data.reduce((res:any, val:any) => {
                res[`${val.gemeente2019}_${val.year}`] = {
                    net_manager: val.net_manager,
                    gemeente2019: val.gemeente2019,
                    gemeentenaam2019: val.gemeentenaam2019,
                    year: val.year,
                    annual_consume: val.annual_consume,
                    annual_consume_lowtarif_color: normalizeData(Math.log10(val.annual_consume_low_tarif), Math.log10(annual_consume_low_tarif_min), Math.log10(annual_consume_low_tarif_max)),
                    annual_consume_color: normalizeData(Math.log10(val.annual_consume), Math.log10(annual_consume_min), Math.log10(annual_consume_max)),
                    num_connections_color: normalizeData(Math.log10(val.num_connections), Math.log10(num_connections_min), Math.log10(num_connections_max)),
                    delivery_perc_color: Math.floor(val.delivery_perc/val.delivery_perc_count),
                    perc_of_active_connections_color: Math.floor(val.perc_of_active_connections/val.perc_of_active_connections_count),
                    smartmeter_perc_color: Math.floor(val.smartmeter_perc/val.perc_of_active_connections_count),
                };
                values.push(res[`${val.gemeente2019}_${val.year}`]);
                return res;
            }, {});
        
            if(values){
                if(Object.keys(values).length > 0){
                    console.log(values);
                    let result: any = {};
                    result.values = values;
                    result.legend = legend;
                    return result;
                } else {
                    return null;
                }
            } else {
                return false;
            }
    }
}


export async function getSpecificData(scope:string, id:number){
    let elec:any;
    let gas:any;
    let elecManager:any;
    let gasManager:any;

    switch (scope) {
        case "national":
            elec = await Electricity.findAll({
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'year'],
                raw: true,
            });

            gas = await Gas.findAll({
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'year'],
                raw: true,
            });

            elecManager = await Electricity.findAll({
                attributes: [
                    'net_manager',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'year'],
                raw: true,
            });

            gasManager = await Gas.findAll({
                attributes: [
                    'net_manager',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'year'],
                raw: true,
            });
            break;

        case "gemeente":
            elec = await Electricity.findAll({
                where: {
                    gemeente2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'year'],
                raw: true,
            });

            gas = await Gas.findAll({
                where: {
                    gemeente2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'year'],
                raw: true,
            });

            elecManager = await Electricity.findAll({
                where: {
                    gemeente2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'year'],
                raw: true,
            });

            gasManager = await Gas.findAll({
                where: {
                    gemeente2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'year'],
                raw: true,
            });
            break;

        case "wijk":
            elec = await Electricity.findAll({
                where: {
                    wijk2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'year'],
                raw: true,
            });

            gas = await Gas.findAll({
                where: {
                    wijk2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'year'],
                raw: true,
            });

            elecManager = await Electricity.findAll({
                where: {
                    wijk2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'year'],
                raw: true,
            });

            gasManager = await Gas.findAll({
                where: {
                    wijk2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'year'],
                raw: true,
            });
            break;

        case "buurt":
            elec = await Electricity.findAll({
                where: {
                    buurt2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'street',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'street', 'year'],
                raw: true,
            });

            gas = await Gas.findAll({
                where: {
                    buurt2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'street',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('smartmeter_perc')), 'smartmeter_perc'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'street', 'year'],
                raw: true,
            });

            elecManager = await Electricity.findAll({
                where: {
                    buurt2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'year'],
                raw: true,
            });

            gasManager = await Gas.findAll({
                where: {
                    buurt2019: {
                        [Op.like]: id
                    },
                },
                attributes: [
                    'net_manager',
                    'gemeente2019',
                    'gemeentenaam2019',
                    'wijk2019',
                    'wijknaam2019',
                    'buurt2019',
                    'buurtnaam2019',
                    'year',
                    [fn('sum', col('annual_consume')), 'annual_consume'],
                    [fn('sum', col('num_connections')), 'num_connections'],
                    [fn('avg', col('annual_consume_lowtarif_perc')), 'annual_consume_lowtarif_perc'],
                    [fn('avg', col('delivery_perc')), 'delivery_perc'],
                    [fn('avg', col('perc_of_active_connections')), 'perc_of_active_connections'],
                ],
                group: ['net_manager', 'gemeente2019', 'gemeentenaam2019', 'wijk2019', 'wijknaam2019', 'buurt2019', 'buurtnaam2019', 'year'],
                raw: true,
            });
            break;
    }

    const result = {
        "electricity": elec,
        "gas": gas,
        "electricity_manager": elecManager,
        "gas_manager": gasManager,
    };

    if(result){
        // console.log(result);
        return result;
    } else {
        return null;
    }
}

function getAverage(array:any) {
    const sum = array.reduce((a:number, b:number) => a + b, 0);
    return sum / array.length;
  }

function normalizeData(x:number, min:number, max:number){
    return Math.floor(((x-min)/(max-min))*100);
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