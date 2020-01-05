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


const getListItem = (scope, item) => {
    switch(scope){
        case 'buurt':
            return <ListItemText
            primary={item.buurtnaam2019}
            secondary={item.city}
        />
        case 'gemeente':
            return <ListItemText
            primary={item.gemeentenaam2019}
            secondary={item.city}
        />
        case 'wijk':
            return <ListItemText
            primary={item.wijknaam2019}
            secondary={item.city}
        />
        default:
        return <ListItemText
            primary={"ERROR"}
            secondary={"error"}
        />
    }
}


const getListTitle = (scope) => {
    switch(scope){
        case 'buurt':
            return "Buurten"
        case 'gemeente':
            return "Gemeenten"
        case 'wijk':
            return "Wijken"
        default:
            return "Error"
    }
}


class ListView extends Component {

    state = {
        allItems: {},
        shownItems: {},
        searchTerm: ''
    }


    componentDidMount = () => {
        this.setState({allItems: this.props.nationalData, shownItems: this.props.nationalData})
    }

    handleSearch = (e) => {
        // TODO: update to use json info instead of example string
        // const searchResult = this.state.allItems.filter(name => name.includes(e.target.value))
        const currentItems = this.state.allItems;
        console.log('searching:' +e.target.value);
        
        if(e.target.value){
            const searchResult = []
            for (const key in currentItems) {
                if (currentItems.hasOwnProperty(key)) {
                    if (Object.values(currentItems[key]).toString().indexOf(e.target.value) !== -1) {
                        searchResult.push(currentItems[key])
                    }
                }
            }
            this.setState({shownItems: searchResult});
        } else {
            this.setState({shownItems: this.state.allItems});
        }
    }


    handleClick = (identifier) => {
        console.log('selected new item: ' + identifier);
        this.props.selectItem(identifier);
    }

    render() {
        const { classes } = this.props;
        console.log(this.props.scope);
        return (
            <div style={{height: '100%'}}>
                <Grid container direction="column" justify="flex-start" style={{height: '100%'}}>
                <Grid item style={{height:'50px'}}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%'}} >
                            <Grid item style={{paddingTop: '10px', paddingLeft: '10px'}}><Typography variant="h6">{getListTitle(this.props.scope)}</Typography>
                            </Grid>
                            <Grid item >
                                <TextField size="small" id="outlined-basic" label="Search" variant="outlined" style={{width: '140px'}} onChange={this.handleSearch}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{overflow: 'auto', height: '85%'}}>
                        <List className={classes.list}>
                            {
                                Object.keys(this.state.shownItems).map((n, i) =>
                                    <div key={i}>
                                        <ListItem key={i} button onClick={() => this.handleClick(n)}>
                                            <ListItemAvatar >
                                                <NeighbourhoodIcon />
                                            </ListItemAvatar>
                                            {getListItem(this.props.scope, this.state.shownItems[n])}
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