import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, Button, Slider, Typography, FormControl, Select, InputLabel, FormLabel, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';


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

class Settings extends Component {
    state = {
        energySource: 'electricity',
        mapSetting: 1,
        timeframe: 1
    }


    handleToggle = (e) => {
        this.setState({ energySource: e.target.value })
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
                            Energy Source
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
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Timeframe
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
                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Visualization
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
                    <Grid item xs={12} style={{paddingTop: '10px' }}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                            Color
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
                    <Grid item xs={12} style={{ paddingTop: '30px' }}>
                        <Grid container direction="row" justify="flex-end">
                            <Grid item>
                                <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
                                    Reset
                        </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary">
                                    Apply
                        </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Settings);