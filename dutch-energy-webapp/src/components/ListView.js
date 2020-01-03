import React, { Component } from 'react'
import { Grid, Typography, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import 'boxicons';


const NeighbourhoodIcon = () => <box-icon color="#B3B9C4"  type='solid' name='city' size="md"></box-icon>

const styles = theme => ({
    list: {
        marginTop: '10px',
        backgroundColor: theme.palette.background.paper,
    },
});



class ListView extends Component {

    state = {
        allItems: [],
        shownItems: [],
        searchTerm: ''
    }


    componentDidMount = () => {
        this.setState({allItems: this.props.items, shownItems: this.props.items})
    }


    handleSearch = (e) => {
        //TODO: update to use json info instead of example string
        const searchResult = this.state.allItems.filter(name => name.includes(e.target.value))
        this.setState({shownItems: searchResult});
    }

    handleClick = () => {
        //TODO

    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{height: '100%'}}>
                <Grid container direction="column" justify="flex-start" style={{height: '100%'}}>
                <Grid item style={{height:'50px'}}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%'}} >
                            <Grid item style={{paddingTop: '10px', paddingLeft: '10px'}}><Typography variant="h6">List</Typography>
                            </Grid>
                            <Grid item >
                                <TextField size="small" id="outlined-basic" label="Search" variant="outlined" style={{width: '140px'}} onChange={this.handleSearch}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{overflow: 'auto', height: '85%'}}>
                        <List className={classes.list}>
                            {
                                this.state.shownItems.map((n, i) =>
                                    <div key={i}>
                                        <ListItem key={i} button onClick={() => console.log('click :)')}>
                                            <ListItemAvatar >
                                                <NeighbourhoodIcon />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={"Woensel " + n}
                                                secondary={"Eindhoven, Noord-Brabant"}
                                            />
                                        </ListItem>
                                        <Divider variant="inset" />
                                    </div>
                                )
                            }
                        </List>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(ListView);