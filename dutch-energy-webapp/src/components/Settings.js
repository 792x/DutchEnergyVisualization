import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, Button, Slider, Typography, FormControl, Select, InputLabel, FormLabel, Radio, RadioGroup, FormControlLabel, CircularProgress} from '@material-ui/core';


const styles = theme => ({
    root: {
        height: '100%',
        padding: '10px'
    },
    paper: {
        padding: '16px',
        width: '100%',
        margin: '10px',
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    wrapper: {
        position: 'relative',
      },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
      },
});

class Settings extends Component {

    state = {
        loading: false,
        scopeSetting: 'gemeente',
        netManagerSetting: 'all',
        energySourceSetting: 'electricity',
        timeframeSetting : 1,
        dataSetting: 1,
        colorSetting: 1,
    }
    
    delayHelper = ms => new Promise(res => setTimeout(res, ms));

    handleApplyClick = async (e) => {
        await this.props.applyMapSettings(
            this.state.scopeSetting, 
            this.state.netManagerSetting, 
            this.state.energySourceSetting, 
            this.state.timeframeSetting, 
            this.state.dataSetting, 
            this.state.colorSetting
        )
    }

    handleScopeSettingChange = (e) => {
        this.setState({scopeSetting: e.target.value});
        console.log(e.target.value);
    }

    handlenetManagerSettingChange = (e) => {
        this.setState({netManagerSetting: e.target.value});
        console.log(e.target.value);
    }

    handleEnergySourceSettingChange = (e) => {
        this.setState({energySourceSetting: e.target.value});
        console.log(e.target.value);
    }

    handleTimeFrameSettingChange = (e) => {
        this.setState({timeframeSetting: e.target.value});
        console.log(e.target.value);
    }

    handleDataSettingChange = (e) => {
        this.setState({dataSetting: e.target.value});
        console.log(e.target.value);
    }

    handleColorSettingChange = (e) => {
        this.setState({colorSetting: e.target.value});
        console.log(e.target.value);
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container direction="column" justify="flex-start">
                    <Grid item xs={12}>
                        <Typography align="left" variant="h6">Map Settings</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Scope
                             </InputLabel>
                            <Select
                                native
                                value={this.state.scopeSetting}
                                onChange={this.handleScopeSettingChange}
                            >
                                <option value={'gemeente'}>Gemeenten</option>
                                <option value={'wijk'}>Wijken</option>
                                <option value={'buurt'}>Buurten</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Net Manager
                             </InputLabel>
                            <Select
                                native
                                value={this.state.netManagerSetting}
                                onChange={this.handlenetManagerSettingChange}
                            >
                                <option value={'all'}>All</option>
                                <option value={'Enexis'}>Enexis</option>
                                <option value={'Liander'}>Liander</option>
                                <option value={'Stedin'}>Stedin</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
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
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
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
                                <option value={14}>Last ten years</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Data
                             </InputLabel>
                            <Select
                                native
                                value={this.state.dataSetting}
                                onChange={this.handleDataSettingChange}
                            >
                                <option value={1}>Energy consumption</option>
                                <option value={2}>Energy low tarif consumption</option>
                                <option value={3}>Percentage of smartmeters</option>
                                <option value={4}>Number of connections</option>
                                <option value={5}>Percentage of active connections</option>
                                <option value={6}>Delivery percentage</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Color
                             </InputLabel>
                            <Select
                                native
                                value={this.state.colorSetting}
                                onChange={this.handleColorSettingChange}
                            >
                                <option value={1}>Red-blue</option>
                                <option value={2}>Red-green</option>
                                <option value={3}>Red-yellow</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: '30px' }}>
                        <Grid container direction="row" justify="flex-end">
                            <Grid item>
                                <div className={classes.wrapper}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={this.state.loading}
                                        onClick={this.handleApplyClick}
                                    >
                                        Apply
                                        </Button>
                                    {this.props.mapLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Settings);