import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, FormLabel, FormControl, Select, InputLabel } from '@material-ui/core';


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

class Data extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container direction="column" justify="flex-start" style={{ height: '100%' }}>
                    <Grid item style={{ height: '48px' }}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '48px' }} >
                            <Grid item style={{marginTop:'10px', marginLeft: '10px'}}><Typography variant="h6">Neighbourhood Statistics: <strong>Woensel</strong></Typography>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item  style={{paddingRight: '20px'}} >
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Energy Source
                                            </InputLabel>
                                            <Select
                                                style={{width:'150px'}}
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
                                    <Grid item style={{paddingRight: '20px'}}>
                                        <FormControl >
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
                                    <Grid item>
                                        <FormControl >
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Chart Type
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
                                                <option value={1}>Bar charts</option>
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        ajsdklf
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Data);

