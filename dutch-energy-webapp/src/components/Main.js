import React, { Component } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import fetch from 'node-fetch'
import ListView from './ListView';
import Map from '../components/Map'
import Settings from '../components/Settings';
import Data from '../components/Data';


const styles = theme => ({
    root: {
        height: '100%',
    },
    paper: {
        padding: '16px',
        width: '100%',
        margin: '10px',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#FF6200'
      },
      secondary: {
        main: '#B3B9C4'
      }
    },
  });

class Main extends Component {
    state = {
        selectedNeighbourhood: null, //null for full country, BU code for specific neighbourhood
        mapScopeSetting: 'buurt', //buurt, wijk, gemeente
        mapNetManagerSetting: 'all',
        mapEnergySourceSetting: 'electricity',
        mapTimeframeSetting : 1,
        mapDataSetting: 1,
        mapColorSetting: 1,
    }


    fetchNationalData = async (scopeSetting, netManagerSetting, energySourceSetting, timeframeSetting, dataSetting) => {
        //fetch national data based on map settings
        await fetch(`http://localhost:3001/national?scope=${scopeSetting}&netmanager=${netManagerSetting}&energysource=${energySourceSetting}&timeframe=${timeframeSetting}&data=${dataSetting}`)
            .then(res => res.json())
            //We should also check res.status to see if status code matches for error handling
            .then(json => {
                // let annualCityConsumption = json.annual_city_consumption;
                // this.setState({result: annualCityConsumption, last_city: city, city: ''})
                console.log(json);
            });
    };

    fetchSpecificData = async (city) => {
        //todo, fetch data for specific buurt, wijk or gemeente
        await fetch('http://localhost:3001/specific' + city)
        .then(res => res.json())
        //We should also check res.status to see if status code matches for error handling
        .then(json => {
            let annualCityConsumption = json.annual_city_consumption;
            this.setState({result: annualCityConsumption, last_city: city, city: ''})
        });
    };

    applyMapSettings = (scopeSetting, netManagerSetting, energySourceSetting, timeframeSetting, dataSetting, colorSetting) => {
        this.setState({
            mapScopeSetting: scopeSetting,
            mapNetManagerSetting: netManagerSetting,
            mapEnergySourceSetting: energySourceSetting,
            mapTimeframeSetting : timeframeSetting,
            mapDataSetting: dataSetting,
            mapColorSetting: colorSetting,
        })
    }
    
    componentDidMount = async () => {
        this.fetchNationalData(this.state.mapScopeSetting, this.state.mapNetManagerSetting, this.state.mapEnergySourceSetting, this.state.mapTimeframeSetting, this.state.mapDataSetting);
    }
    
    

    render() {
        const { classes } = this.props;
        console.log('yohoho', this.state.mapScopeSetting)
        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Grid container style={{ height: '100%' }} direction="column" justify="space-between">
                        <Grid item style={{ display: 'flex' }} xs={12}>
                            <Grid container direciton="column" justify="space-between">
                                <Grid item style={{ display: 'flex' }} xs={3}>
                                    <Paper className={classes.paper}>
                                        <Settings applyMapSettings={this.applyMapSettings}/>
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '55vh' }} xs={6}>
                                    <Paper className={classes.paper}>
                                        <Map scope={this.state.mapScopeSetting}/>
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '55vh' }} xs={3}>
                                    <Paper className={classes.paper}>
                                       <ListView scope={this.state.scope} items={['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'ho', 'fd', 'asdf', 'kdjsf',]} />
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '45vh' }} xs={12}>
                                    <Paper className={classes.paper}>
                                        <Data />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(Main);