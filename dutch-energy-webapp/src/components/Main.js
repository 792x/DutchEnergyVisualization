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

const handleTimeframe = (timeframesetting) => {
    console.log('handltimeframe', timeframesetting)
    switch(timeframesetting){
        case '1':
            return [2019];
        case '2':
            return [2018];
        case '3':
            return [2017];
        case '4':
            return [2016];
        case '5':
            return [2015];
        case '6':
            return [2014];
        case '7':
            return [2013];
        case '8':
            return [2012];
        case '9':
            return [2011];
        case '10':
            return [2010];
        case '11':
            return [2019, 2018];
        case '12':
            return [2019, 2018, 2017];
        case '13':
            return [2019, 2018, 2017, 2016, 2015];
        case '14':
            return [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];
        default:
            console.log('defautl case hit of handletimeframe')
    }
}

class Main extends Component {
    state = {
        selectedItem: null, //null for full country, code for wijk/gemeente/buurt
        selectedListItem: null,
        selectedItemType: null, //buurt, wijk, gemeente
        mapScopeSetting: 'gemeente', //buurt, wijk, gemeente
        mapNetManagerSetting: 'all',
        mapEnergySourceSetting: 'electricity',
        mapTimeFrameSetting : '1',
        mapDataSetting: '1',
        mapColorSetting: '1',
        shownNationalData: null,
        nationalData: null,
        loadingNationalData: false,
        specificData: null,
        loadingSpecificData: false,
        currentAnimationYear: ''
    }

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
    // <option value={14}>Last ten years</option>

    fetchNationalData = async (scopeSetting, energySourceSetting) => {
        //fetch national data based on map settings
        const result = await fetch(`http://localhost:3001/national?scope=${scopeSetting}&energysource=${energySourceSetting}`)
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

    loadNationalData = async () => {
        await this.setState({loadingNationalData: true});
        let nationalDataResult = await this.fetchNationalData(this.state.mapScopeSetting, this.state.mapEnergySourceSetting);
        let nationalDataParsed = await JSON.parse(nationalDataResult);
        this.setState({nationalData: nationalDataParsed, loadingNationalData: false});
    }

    loadSpecificData = async (id) => {
        this.setState({loadingSpecificData: true});
        let specificDataResult = await this.fetchSpecificData(this.state.mapScopeSetting, id);
        let specificDataParsed = await JSON.parse(specificDataResult);
        this.setState({specificData: specificDataParsed, loadingSpecificData: false});
    }
    delayHelper = ms => new Promise(res => setTimeout(res, ms));

    startAnimation = async () => {
        let allowedYears = handleTimeframe(this.state.mapTimeFrameSetting);
        console.log('tfsetting', this.state.mapTimeFrameSetting);
        //todo block apply button, block animate button
        console.log('animating years:', allowedYears)
        if(allowedYears.length > 1){
            for (let i = allowedYears.length; i > 0; i--) {
                console.log(i);
                let currentYear = await handleTimeframe(i.toString());
                await this.setState({currentAnimationYear: currentYear[0] })
                await this.applyMapSettings(this.state.mapScopeSetting, this.state.mapNetManagerSetting, this.state.mapEnergySourceSetting, i.toString(), this.state.mapDataSetting, this.state.mapColorSetting);
                await this.delayHelper(1000);
            }
        }
        this.setState({currentAnimationYear: '' })
    }

    applyMapSettings = async (scopeSetting, netManagerSetting, energySourceSetting, timeFrameSetting, dataSetting, colorSetting) => {
        console.log('applying settings:', scopeSetting, netManagerSetting, energySourceSetting, timeFrameSetting, dataSetting, colorSetting)
        let prevMapScopeSetting = this.state.mapScopeSetting;
        let prevEnergySourceSetting = this.state.mapEnergySourceSetting;
        let shownNationalData = this.state.nationalData;
        let allowedYears = handleTimeframe(timeFrameSetting);
        console.log('allowedYears', allowedYears);


        //reload data only if we change scope setting
        if(prevMapScopeSetting !== scopeSetting || prevEnergySourceSetting !== energySourceSetting ){
            await this.setState({mapScopeSetting: scopeSetting, mapEnergySourceSetting: energySourceSetting});
            await this.loadNationalData();
        }

        //filter for net manager setting
        if(netManagerSetting !== 'all'){
            switch(netManagerSetting){
                case 'liander':
                    shownNationalData = shownNationalData.filter(e => e.net_manager.includes("Liander"));
                    break;
                case 'enexis':
                    shownNationalData = shownNationalData.filter(e => e.net_manager.includes("Enexis"));
                    break;
                case '8716':
                    shownNationalData = shownNationalData.filter(e => e.net_manager.includes("8716"));
                    break;
                default:
                    console.log('something went wrong filtering for net manager settings')
            }
        } else {
            shownNationalData = this.state.nationalData;
        }
        console.log(this.state.nationalData);


        //filter for year setting
        shownNationalData = shownNationalData.filter(e => allowedYears.includes(e.year));

        //apply setting
        this.setState({
            shownNationalData: shownNationalData,
            mapScopeSetting: scopeSetting,
            mapNetManagerSetting: netManagerSetting,
            mapEnergySourceSetting: energySourceSetting,
            mapTimeFrameSetting : timeFrameSetting,
            mapDataSetting: dataSetting,
            mapColorSetting: colorSetting,
        })
    }
    
    selectListItem = async (identifier) => {
        this.setState({selectedListItem: identifier});
    }

    selectItem = async (identifier) => {
        console.log('selected new item: ' + identifier);
        this.setState({selectedItem: identifier, selectedListItem: identifier, selectedItemType: this.state.mapScopeSetting});
        this.loadSpecificData(identifier);
    }

    clearSelection = async () => {
        //TODO CLEAR SELECTION CAS

    }
    
    componentDidMount = async () => {
        await this.loadNationalData();
        this.applyMapSettings(this.state.mapScopeSetting, this.state.mapNetManagerSetting, this.state.mapEnergySourceSetting, this.state.mapTimeFrameSetting, this.state.mapDataSetting, this.state.mapColorSetting);
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
                                        <Settings applyMapSettings={this.applyMapSettings} startAnimation={this.startAnimation} animationYear={this.state.currentAnimationYear}/>
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '100%', padding: '20px 10px 10px 10px' }} xs={6}>
                                    <Paper className={classes.paper}>
                                        <Map scope={this.state.mapScopeSetting} selectItem={this.selectItem} selectedListItem={this.state.selectedListItem} nationalData={this.state.shownNationalData} mapDataSetting={this.state.mapDataSetting} mapColorSetting={this.state.mapColorSetting}/>
                                    </Paper>
                                </Grid>
                                <Grid item style={{ display: 'flex', height: '100%', padding: '20px 20px 10px 10px' }} xs={3}>
                                    <Paper className={classes.paper}>
                                        {this.state.loadingNationalData ? <LoadingSpinner /> : <ListView scope={this.state.mapScopeSetting} nationalData={this.state.nationalData ? this.state.nationalData.filter(e => e.year===2019) : []} selectListItem={this.selectListItem} />}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item style={{ display: 'flex', height: '45%', padding: '10px 20px 20px 20px' }} xs={12}>
                            <Paper className={classes.paper}>
                                <Data scope={this.state.mapScopeSetting} specificData={this.state.specificData} selectedItem={this.state.selectedItem} loading={this.state.loadingSpecificData} clearSelection={this.clearSelection}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(Main);