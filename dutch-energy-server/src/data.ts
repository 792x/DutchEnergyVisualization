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

async function loadFileInDatabase(file: any) {
    const client = new Client( {
        user: settings.username,
        database: 'dutch_energy',
        password: settings.password,
        host: settings.host,
        port: settings.port,});
    await client.connect();
    console.log('Importing.. ' + file);
    try {
        await client.query(`copy public."Electricity" (net_manager, purchase_area, street, zipcode_from, zipcode_to, city, delivery_perc, num_connections, perc_of_active_connections, type_conn_perc, type_of_connection, annual_consume, annual_consume_lowtarif_perc, smartmeter_perc) FROM '${file}' DELIMITER ',' CSV HEADER QUOTE '\"' `);
        console.log('Imported succesfully');
    } catch (err){
        console.log(`Something went wrong importing the file: ` + err);
    }
    await client.end();
}

export async function loadData(){
    const datapath =  process.env.DATAPATH ? process.env.DATAPATH : '/tmp/data/';
    const electricity_files: any = await readdirAsync(datapath + 'dutch_energy/Electricity');
    for (const file of electricity_files){
        await loadFileInDatabase(datapath + 'dutch_energy/Electricity/' + file)
    }
    const gas_files: any = await readdirAsync(datapath + 'dutch_energy/Gas');
    for (const file of gas_files){
        await loadFileInDatabase(datapath + 'dutch_energy/Gas/' + file)
    }
}