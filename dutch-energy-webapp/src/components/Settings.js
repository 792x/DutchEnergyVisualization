import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, Slider, Typography, FormControl, Select, InputLabel, FormLabel, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';


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
});


const marks = [
    {
        value: 0,
        label: '1',
    },
    {
        value: 10,
        label: '2',
    },
    {
        value: 50,
        label: '5',
    },
    {
        value: 100,
        label: 'All',
    },
];

class Settings extends Component {
    state = {
        energySource: 'electricity',
        mapSetting: 1,
        timeframe: 1
    }


    handleToggle = (e) => {
        this.setState({ energySource: e.target.value })
    }
    valueLabelFormat = (value) => {
        return marks.findIndex(mark => mark.value === value) + 1;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container direction="column" justify="flex-start">
                    <Grid item xs={12}>
                        <Typography align="left" variant="h6">Map Settings</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '20px' }}>
                        <FormLabel component="legend">Energy Source</FormLabel>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                                Select
                             </InputLabel>
                            <Select
                                native
                                // value={state.age}
                                // onChange={handleChange('age')}
                                // labelWidth={labelWidth}
                                inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value="" />
                                <option value={1}>Electricity</option>
                                <option value={2}>Gas</option>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '20px' }}>
                        <FormLabel component="legend">Timeframe</FormLabel>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                                Select
                             </InputLabel>
                            <Select
                                native
                                // value={state.age}
                                // onChange={handleChange('age')}
                                // labelWidth={labelWidth}
                                inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value="" />
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
                    <Grid item xs={12} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '30px' }}>
                        <FormLabel component="legend">Map setting</FormLabel>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                                Select
                             </InputLabel>
                            <Select
                                native
                                // value={state.age}
                                // onChange={handleChange('age')}
                                // labelWidth={labelWidth}
                                inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value="" />
                                <option value={1}>Energy consumption</option>
                                <option value={2}>Energy low tarif consumption</option>
                                <option value={3}>Percentage of smartmeters</option>
                                <option value={4}>Number of connections</option>
                                <option value={5}>Percentage of active connections</option>
                                <option value={6}>Delivery percentage</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '30px' }}>
                        <FormLabel component="legend">Color setting</FormLabel>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                                Select
                             </InputLabel>
                            <Select
                                native
                                // value={state.age}
                                // onChange={handleChange('age')}
                                // labelWidth={labelWidth}
                                inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple',
                                }}
                            >
                                <option value="" />
                                <option value={1}>Red-blue</option>
                                <option value={2}>Red-green</option>
                                <option value={3}>Red-yellow</option>
                                <option value={4}>Number of connections</option>
                                <option value={5}>Percentage of active connections</option>
                                <option value={6}>Delivery percentage</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Settings);