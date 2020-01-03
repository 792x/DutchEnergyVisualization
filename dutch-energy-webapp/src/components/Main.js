import React, { Component } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import NeighbourhoodList from '../components/NeighbourhoodList';
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
        main: '#FF9100'
      },
      secondary: {
        main: '#B3B9C4'
      }
    },
  });

class Main extends Component {
    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={theme}>
            <div className={classes.root}>

                
                    <Grid container style={{height: '100%'}} direction="column" justify="space-between">
                        <Grid item style={{display: 'flex'}} xs={12}>
                            <Grid container direciton="column" justify="space-between">
                            <Grid item style={{display: 'flex'}} xs={3}>
                            <Paper className={classes.paper}>
                                <Settings />
                            </Paper>
                        </Grid>
                                <Grid item style={{display: 'flex', height: '65vh'}} xs={6}>
                                    <Paper className={classes.paper}>
                                        <Map />
                                    </Paper>
                                </Grid>
                                <Grid item style={{display: 'flex', height: '65vh'}} xs={3}>
                                    <Paper className={classes.paper}>
                                        <NeighbourhoodList neighbourhoods={['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'ho', 'fd', 'asdf', 'kdjsf', ]} />
                                    </Paper>
                                </Grid>
                                <Grid item style={{display: 'flex', height: '35vh'}} xs={12}>
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