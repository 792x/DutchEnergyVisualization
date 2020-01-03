import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
    center: {
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
    }

});


class LoadingSpinner extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.center}>
                <CircularProgress size={48}/>
            </div>
        )
    }
}

export default withStyles(styles)(LoadingSpinner);