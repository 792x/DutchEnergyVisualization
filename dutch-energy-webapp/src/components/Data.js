import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, FormLabel, FormControl, Select, InputLabel, StylesProvider } from '@material-ui/core';
import { BarChart, BarChart2, LineChart, PieChart } from '../components/Charts'


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
                selected.gemeente = props.specificData[0].gemeentenaam2019;
                selected.wijk = props.specificData[0].wijknaam2019;
                break;

            case 'buurt':
                selected.gemeente = props.specificData[0].gemeentenaam2019;
                selected.wijk = props.specificData[0].wijknaam2019;
                selected.buurt = props.specificData[0].buurtnaam2019;
                break;
        }
    } else {
        selected.gemeente = '...';
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
    } else {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>
            </Typography>
        )
    }
}


class Data extends Component {

    state = {
        loading: false,
        energySourceSetting: 'electricity',
        chartTypeSetting: 1,
        timeframeSetting: 1,
    }

    handleTimeFrameSettingChange = (e) => {
        this.setState({ timeframeSetting: parseInt(e.target.value) });
        console.log(e.target.value);
    }

    handleChartTypeSettingChange = (e) => {
        this.setState({ chartTypeSetting: e.target.value });
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


    render() {
        const { classes } = this.props;
        
        const graphSettings = {
            width: 450,
            height: 400,
            margin: 60,
        };

        return (
            <div className={classes.root}>
                <Grid container direction="column" justify="flex-start" style={{ height: '100%' }}>
                    <Grid item style={{ height: '48px' }}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '48px' }} >
                            <Grid item style={{ marginTop: '10px', marginLeft: '10px' }}>
                                <SelectedItem scope={this.props.scope} specificData={this.props.specificData}></SelectedItem>
                            </Grid>
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
                                                Chart Type
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.chartTypeSetting}
                                                onChange={this.handleChartTypeSettingChange}
                                            >
                                                <option value={1}>Trends</option>
                                                <option value={2}>Bar charts</option>
                                                <option value={3}>Pie charts</option>
                                                <option value={4}>Distributions</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{ height: '400px' }}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%', marginTop: '10px' }} >
                            {/* <Grid item style={{ width: '32%' }}>
                                <BarChart data={this.props.specificData} settings={graphSettings}></BarChart>
                            </Grid> */}

                            <Grid item style={{ width: '32%' }}>
                                <BarChart2
                                    id='barchart1'
                                    data={this.props.specificData}
                                    settings={graphSettings}
                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                    source={this.state.energySourceSetting}
                                ></BarChart2>
                            </Grid>

                            <Grid item style={{ width: '32%' }}>
                                <PieChart
                                    id='piechart1'
                                    data={this.props.specificData}
                                    settings={graphSettings}
                                    years={this.handleTimeframe(this.state.timeframeSetting)}
                                    source={this.state.energySourceSetting}
                                ></PieChart>
                            </Grid>

                            {/* <Grid item style={{ width: '32%' }}>
                                <LineChart data={this.props.specificData} settings={graphSettings}></LineChart>
                            </Grid> */}

                            <Grid item style={{ width: '32%' }}>
                                <LineChart
                                    id='linechart1'
                                    data={this.props.specificData}
                                    settings={graphSettings}
                                ></LineChart>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Data);

