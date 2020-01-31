import React, { Component } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import fetch from 'node-fetch'
import ListView from './ListView';
import Map from '../components/Map'
import Settings from '../components/Settings';
import Data from '../components/Data';
import LoadingSpinner from './LoadingSpinner';


const styles = theme => ({
    root: {
        height: '100%',
        width: '100%',
    },
    paper: {
        padding: '16px',
        width: '100%',
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
        selectedItem: null, //null for full country, code for wijk/gemeente/buurt
        selectedListItem: null,
        selectedItemType: null, //buurt, wijk, gemeente
        mapScopeSetting: 'gemeente', //buurt, wijk, gemeente
        mapNetManagerSetting: 'all',
        mapEnergySourceSetting: 'electricity',
        mapTimeframeSetting : '1',
        mapDataSetting: '1',
        mapColorSetting: '1',
        nationalData: null,
        loadingNationalData: false,
        specificData: null,
        loadingSpecificData: false,
    }


    fetchNationalData = async (scopeSetting, netManagerSetting, energySourceSetting, timeframeSetting, dataSetting) => {
        //fetch national data based on map settings
        const result =await fetch(`http://localhost:3001/nationalsummary?scope=${scopeSetting}&netmanager=${netManagerSetting}&energysource=${energySourceSetting}&timeframe=${timeframeSetting}&data=${dataSetting}`)
            .then(async (response) => {
                if(response.status === 200){
                    console.log('Succesful response');
                    let json = await response.json();
                    return JSON.stringify(json);
                } else {
                    console.log(response);
                }
            })
        return result;
    };

    fetchSpecificData = async (scopeSetting, id) => {
        //todo, fetch data for specific buurt, wijk or gemeente
        const result = await fetch(`http://localhost:3001/specific?scope=${scopeSetting}&id=${id}`)
        .then(async (response) => {
            if(response.status === 200){
                console.log('Succesful response');
                let json = await response.json();
                return JSON.stringify(json);
            } else {
                console.log(response);
            }
        })
        return result;
    };

    loadNationalData = async () =>{
        await this.setState({loadingNationalData: true});
        let nationalDataResult = await this.fetchNationalData(this.state.mapScopeSetting, this.state.mapNetManagerSetting, this.state.mapEnergySourceSetting, this.state.mapTimeframeSetting, this.state.mapDataSetting);
        let nationalDataParsed = await JSON.parse(nationalDataResult);
        this.setState({nationalData: nationalDataParsed, loadingNationalData: false});
    }

    loadSpecificData = async (id) => {
        this.setState({loadingSpecificData: true});
        let specificDataResult = await this.fetchSpecificData(this.state.mapScopeSetting, id);
        let specificDataParsed = await JSON.parse(specificDataResult);
        this.setState({specificData: specificDataParsed, loadingSpecificData: false});
    }

    applyMapSettings = async (scopeSetting, netManagerSetting, energySourceSetting, timeframeSetting, dataSetting, colorSetting) => {

        let prevMapScopeSetting = this.state.mapScopeSetting;

        await this.setState({
            mapScopeSetting: scopeSetting,
            mapNetManagerSetting: netManagerSetting,
            mapEnergySourceSetting: energySourceSetting,
            mapTimeframeSetting : timeframeSetting,
            mapDataSetting: dataSetting,
            mapColorSetting: colorSetting,
        })

        if(prevMapScopeSetting !== scopeSetting){
            this.loadNationalData();
        }
    }
    
    selectListItem = async (identifier) => {
        this.setState({selectedListItem: identifier});
    }

    selectItem = async (identifier) => {
        console.log('selected new item: ' + identifier);
        this.setState({selectedItem: identifier, selectedListItem: identifier, selectedItemType: this.state.mapScopeSetting});
        this.loadSpecificData(identifier);
    }
    
    componentDidMount = async () => {
        await this.loadNationalData();
    }
    
    

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Grid container style={{ height: '100%' }} direction="row" justify="space-between">
                        <Grid item style={{ display: 'flex', height: '55%' }} xs={12}>
                            <Grid container direciton="column" justify="space-between">
                                <Grid item style={{ display: 'flex', height: '100%', padding: '20px 10px 10px 20px' }} xs={3}>
                                    <Paper className={classes.paper}>
                                        <Settings applyMapSettings={this.applyMapSettings} />
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '100%', padding: '20px 10px 10px 10px' }} xs={6}>
                                    <Paper className={classes.paper}>
                                        <Map scope={this.state.mapScopeSetting} selectItem={this.selectItem} selectedListItem={this.state.selectedListItem} nationalData={this.state.nationalData} mapDataSetting={this.state.mapDataSetting}/>
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '100%', padding: '20px 20px 10px 10px' }} xs={3}>
                                    <Paper className={classes.paper}>
                                        {this.state.loadingNationalData ? <LoadingSpinner /> : <ListView scope={this.state.mapScopeSetting} nationalData={this.state.nationalData ? Object.keys(this.state.nationalData).map((k) => this.state.nationalData[k]) : []} selectListItem={this.selectListItem} />}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item style={{ display: 'flex', height: '45%', padding: '10px 20px 20px 20px' }} xs={12}>
                            <Paper className={classes.paper}>
                                <Data scope={this.state.mapScopeSetting} specificData={this.state.specificData} selectedItem={this.state.selectedItem} loading={this.state.loadingSpecificData} />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(Main);