# Dutch Energy Visualization
A dashboard for geographically visualizing the energy usage of The Netherlands across various dimensions.

![https://github.com/792x/DutchEnergyVisualization/blob/master/overview_tool.PNG](https://github.com/792x/DutchEnergyVisualization/blob/master/overview_tool.PNG)

For a demo video see [screencast.mp4](https://github.com/792x/DutchEnergyVisualization/blob/master/screencast.mp4)


For the whitepaper see [DutchEnergyVisualization.pdf](https://github.com/792x/DutchEnergyVisualization/blob/master/DutchEnergyVisualization.pdf)

## Data
The energy consumption data was retrieved from [https://www.kaggle.com/lucabasa/dutch-energy](https://www.kaggle.com/lucabasa/dutch-energy)

The geojson data for The Netherlands was retrieved from [https://cartomap.github.io/nl/](https://cartomap.github.io/nl/)

## Setup

### Clone repo

```
git clone https://github.com/792x/DutchEnergyVisualization.git
```

```
cd DutchEnergyVisualization
```

### Server

#### Installation
```
cd dutch-energy-server
```

```
npm install
```

Copy the data folder somewhere on your system, suggestions are ```C:\Users\Public\``` on windows and ```/tmp``` on Mac/Linux

In the root folder of the ```dutch-energy-server``` project create a ```.ENV``` file and set the ```DATAPATH``` variable to the data folder on your system. 
Make sure the 'postgres' user can access this folder.
```
DATAPATH=/tmp/data/
```

#### Running
Running the server for the first time and importing the files, this also drops the tables (read: empties database).
```
npm run start-overwrite
```


Running the server normally
```
npm start
```

Server now active at ```localhost:3001```

The server expects the following postgres configuration but can be changed in ```database.ts```
```
{
    username: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
}
```


### Webapp

#### Installation
```
cd dutch-energy-webapp
```

```
npm install
```

#### Running
```
npm start
```

Webapp now accessible at ```localhost:3000``` with hot reloading.
