import express, {Request, Response} from 'express';
import { createServer } from 'http';
import database from "./database";
import {create_database} from "./database";
import {loadData} from "./data"
import * as energyRoutingFunctions from './API/EnergyRoutingFunctions';

const cors = require('cors');

require('dotenv').config();

const PORT = 3001;
const server = express();
const createdServer = createServer(server);


const corsOptions = {
    origin: function (origin: any, callback: any) {
        callback(null, true)
    }, credentials: true
};

server.options('*', cors(corsOptions));
server.use(cors(corsOptions));

// JSON
server.use(express.json());

server.get('/', (req, res) => res.status(200).send('server running yooo'));

server.get('/national',
    energyRoutingFunctions.getNationalData
);

server.get('/specific',
    energyRoutingFunctions.getSpecificData
);

server.get('/message', (req, res) => {
    res.status(200).send({message: "yooo"})
});


// Handle the start script to OVERWRITE new database --- danger
const args = process.argv.slice(2);
let eraseDatabaseOnSync = false;
if (args[0] === 'true') {
    eraseDatabaseOnSync = true;
    console.log('FORCE SYNCING DATABASE');
}

async function init(){
    await create_database();
    await database.sync({ force: eraseDatabaseOnSync }).then(async () => {
        if(eraseDatabaseOnSync){
            await loadData();
        }
        createdServer.listen(PORT, () =>
            console.log(`Server is running on port ${PORT}!`)
        );
    });
}

init();


