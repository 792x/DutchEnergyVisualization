import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, FormLabel, FormControl, Select, InputLabel, StylesProvider } from '@material-ui/core';
import { BarChart, LineChart, PieChart } from '../components/Charts';
import { national_data } from '../assets/national_data.js';
import LoadingSpinner from './LoadingSpinner';


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

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const SelectedItem = (props) => {
    let selected = {};
    if (props.specificData) {
        switch (props.scope) {
            case 'gemeente':
                selected.gemeente = props.specificData["electricity"][0].gemeentenaam2019;
                break;

            case 'wijk':
                selected.gemeente = props.specificData["electricity"][0].gemeentenaam2019;
                selected.wijk = props.specificData["electricity"][0].wijknaam2019;
                break;

            case 'buurt':
                selected.gemeente = props.specificData["electricity"][0].gemeentenaam2019;
                selected.wijk = props.specificData["electricity"][0].wijknaam2019;
                selected.buurt = props.specificData["electricity"][0].buurtnaam2019;
                break;
        }
    }

    if (selected.buurt) {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>, Wijk: <strong>{selected.wijk}</strong>, Buurt: <strong>{selected.buurt}</strong>
            </Typography>
        )
    } else if (selected.wijk) {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>, Wijk: <strong>{selected.wijk}</strong>
            </Typography>
        )
    } else if (selected.gemeente) {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>
            </Typography>
        )
    } else {
        return (
            <Typography variant="h6">
                National
            </Typography>
        )
    }
}


class Data extends Component {

    state = {
        loading: false,
        energySourceSetting: 'electricity',
        dataSetting: 1,
        timeframeSetting: 1,
        graphSettings: {
            width: 350,
            height: 320,
            margin: 55,
        },
    }

    handleTimeFrameSettingChange = (e) => {
        this.setState({ timeframeSetting: parseInt(e.target.value) });
        console.log(e.target.value);
    }

    handleDataSettingChange = (e) => {
        this.setState({ dataSetting: parseInt(e.target.value) });
        console.log(e.target.value);
    }

    handleEnergySourceSettingChange = (e) => {
        this.setState({ energySourceSetting: e.target.value });
        console.log(e.target.value);
    }

    handleTimeframe = (timeframe) => {
        switch(timeframe){
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
                return [0];
        }
    }

    componentDidMount() {
        const boxHeight = document.getElementById('data-wrapper').clientHeight - 48;
        console.log(boxHeight);
        document.getElementById('d3-wrapper').style.height = boxHeight+'px';

        this.state.graphSettings.height = boxHeight;
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container direction="row" justify="flex-start" style={{ height: '100%' }} id='data-wrapper'>
                    <Grid item style={{ height: '48px', width: '100%' }}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '48px' }} >
                            <Grid item style={{ marginTop: '10px', marginLeft: '10px' }}>
                                <SelectedItem scope={this.props.scope} specificData={this.props.specificData}></SelectedItem>
                            </Grid>
                            {(() => {
                                if (this.props.loading) {
                                    return (
                                        <Grid item>
                                            <LoadingSpinner />
                                        </Grid>
                                    );
                                }
                            })()}
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item style={{ paddingRight: '20px', width: '150px' }} >
                                        <FormControl className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Energy Source
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.energySourceSetting}
                                                onChange={this.handleEnergySourceSettingChange}
                                            >
                                                <option value={'electricity'}>Electricity</option>
                                                <option value={'gas'}>Gas</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item style={{ paddingRight: '20px' }}>
                                        <FormControl >
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Timeframe
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.timeframeSetting}
                                                onChange={this.handleTimeFrameSettingChange}
                                            >
                                                <option value={1}>2019</option>
                                                <option value={2}>2018</option>
                                                <option value={3}>2017</option>
                                                <option value={4}>2016</option>
                                                <option value={5}>2015</option>
                                                <option value={6}>2014</option>
                                                <option value={7}>2013</option>
                                                <option value={8}>2012</option>
                                                <option value={9}>2011</option>
                                                <option value={10}>2010</option>
                                                <option value={11}>Last two years</option>
                                                <option value={12}>Last three years</option>
                                                <option value={13}>Last five years</option>
                                                <option value={14}>All data</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl >
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Data
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.dataSetting}
                                                onChange={this.handleDataSettingChange}
                                            >
                                                <option value={1}>Total consumption</option>
                                                <option value={2}>Consumption per connection</option>
                                                <option value={3}>Total production</option>
                                                <option value={4}>Production per connection</option>
                                                <option value={5}>Number of connections</option>
                                                <option value={6}>Number of smartmeters</option>
                                                <option value={7}>Market share</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{ height: '260px' }} id='d3-wrapper'>

                        {/* Example */}
                        {/* <Grid item style={{ width: '32%' }}>
                            <BarChart
                                id='barchart0'
                                data={this.props.specificData}
                                settings={graphSettings}
                                years={this.handleTimeframe(this.state.timeframeSetting)}
                                source={this.state.energySourceSetting}
                            ></BarChart>
                        </Grid>

                        <Grid item style={{ width: '32%' }}>
                            <PieChart
                                id='piechart0'
                                data={this.props.specificData}
                                settings={graphSettings}
                                years={this.handleTimeframe(this.state.timeframeSetting)}
                                source={this.state.energySourceSetting}
                            ></PieChart>
                        </Grid>

                        <Grid item style={{ width: '32%' }}>
                            <LineChart
                                id='linechart0'
                                data={this.props.specificData}
                                settings={graphSettings}
                                years={this.handleTimeframe(this.state.timeframeSetting)}
                                source={this.state.energySourceSetting}
                            ></LineChart>
                        </Grid> */}

                        {(() => {
                            switch (this.state.dataSetting) {
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                    return (
                                        /* Total consumption */
                                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '100%' }} >
                                            <Grid item style={{ width: '32%' }}>
                                                <LineChart
                                                    id='linechart1'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    dataType={this.state.dataSetting}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.scope}
                                                    
                                                ></LineChart>
                                            </Grid>

                                            <Grid item style={{ width: '32%' }}>
                                                <BarChart
                                                    id='barchart1'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    dataType={this.state.dataSetting}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.selectedItem === null ? 'national' : this.props.scope}
                                                    type='top'
                                                ></BarChart>
                                            </Grid>

                                            <Grid item style={{ width: '32%' }}>
                                                <BarChart
                                                    id='barchart2'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    dataType={this.state.dataSetting}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.selectedItem === null ? 'national' : this.props.scope}
                                                    type='bottom'
                                                ></BarChart>
                                            </Grid>
                                        </Grid>
                                    );

                                case 7:
                                    return (
                                        /* Market share */
                                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '100%' }} >
                                            <Grid item style={{ width: '32%' }}>
                                                <PieChart
                                                    id='piechart1'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.selectedItem === null ? 'national' : this.props.scope}
                                                    type='cons'
                                                ></PieChart>
                                            </Grid>

                                            <Grid item style={{ width: '32%' }}>
                                                <PieChart
                                                    id='piechart2'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.selectedItem === null ? 'national' : this.props.scope}
                                                    type='prod'
                                                ></PieChart>
                                            </Grid>

                                            <Grid item style={{ width: '32%' }}>
                                                <PieChart
                                                    id='piechart3'
                                                    data={this.props.selectedItem === null ? national_data : this.props.specificData}
                                                    settings={this.state.graphSettings}
                                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                                    source={this.state.energySourceSetting}
                                                    scope={this.props.selectedItem === null ? 'national' : this.props.scope}
                                                    type='nuco'
                                                ></PieChart>
                                            </Grid>
                                        </Grid>
                                    )

                                default:
                                    return null;
                            }
                        })()}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Data);

