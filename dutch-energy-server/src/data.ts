import {settings} from "./database";
const fs = require('fs');
const {Client} = require('pg');
require('dotenv').config();

function readdirAsync(path: any) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, function (error: any, result: any) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

async function loadFileInDatabase(file: any, target:string) {
    const client = new Client( {
        user: settings.username,
        database: 'dutch_energy',
        password: settings.password,
        host: settings.host,
        port: settings.port,});
    await client.connect();
    console.log('Importing.. ' + file);
    try {
        await client.query(`copy public."${target}" (year, net_manager, purchase_area, street, zipcode_from, zipcode_to, city, delivery_perc, num_connections, perc_of_active_connections, type_conn_perc, type_of_connection, annual_consume, annual_consume_lowtarif_perc, smartmeter_perc, Buurt2019 ,Wijk2019 ,Gemeente2019 ,Wijknaam2019 ,Gemeentenaam2019, Buurtnaam2019) FROM '${file}' DELIMITER ',' CSV HEADER QUOTE '\"' `);
        
        console.log('Imported succesfully');
    } catch (err){
        console.log(`Something went wrong importing the file: ` + err);
    }
    await client.end();
}

export async function loadData(){
    const datapath =  process.env.DATAPATH ? process.env.DATAPATH : '/tmp/data/';
    const electricity_files: any = await readdirAsync(datapath + 'dutch_energy_extended/Electricity');
    for (const file of electricity_files){
        await loadFileInDatabase(datapath + 'dutch_energy_extended/Electricity/' + file, 'Electricity');
    }
    const gas_files: any = await readdirAsync(datapath + 'dutch_energy_extended/Gas');
    for (const file of gas_files){
        await loadFileInDatabase(datapath + 'dutch_energy_extended/Gas/' + file, 'Gas');
    }
    const client = new Client( {
        user: settings.username,
        database: 'dutch_energy',
        password: settings.password,
        host: settings.host,
        port: settings.port,});
    await client.connect();
    await client.query(`UPDATE public."Electricity" SET delivery_perc=num_connections, num_connections=delivery_perc WHERE net_manager LIKE 'Enexis%';`);
    await client.query(`UPDATE public."Gas" SET delivery_perc=num_connections, num_connections=delivery_perc WHERE net_manager LIKE 'Enexis%';`);
    await client.end();
}