import { Sequelize } from 'sequelize-typescript';
import models from './models/Models';
const { Client } = require('pg');

require('dotenv').config();

export let settings: any = {
    database: 'dutch_energy',
    username: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    storage: ':memory:',
    dialect: 'postgres',
    operatorsAliases: 'false',
    modelPaths: ['./models'],
};


export async function create_database() {
    const client = new Client( {
        user: settings.username,
        database: 'postgres',
        password: settings.password,
        host: settings.host,
        port: settings.port,});
    await client.connect();
    console.log('Creating database...');
    try {
        await client.query(`CREATE DATABASE ${settings.database};`);
        console.log('Created succesfully');
    } catch (err){
        console.log(`${settings.database} database already exists`);
    }
    await client.end();
}

const db = new Sequelize(settings);
db.addModels(models);

export default db;
