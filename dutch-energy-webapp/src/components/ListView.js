import React, { Component, forwardRef } from 'react'
import { Grid, Typography, IconButton, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField } from '@material-ui/core';
import { FixedSizeList as FList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { withStyles } from '@material-ui/core/styles';
import * as Fuse from 'fuse.js';
import 'boxicons';


const NeighbourhoodIcon = () => <box-icon color="#B3B9C4"  type='solid' name='city' size="md"></box-icon>

const SearchIcon = () => <box-icon color="#B3B9C4"  type='search' name='search' size="sm"></box-icon>

const styles = theme => ({
    list: {
        marginTop: '10px',
        backgroundColor: theme.palette.background.paper,
    },
});

const cutString = (string, length) => {
    if(string.length > length) {
        return string.substring(0, length).concat('...');
    } else {
        return string;
    }
}


const getListItem = (scope, item) => {
    switch(scope){
        case 'buurt':
            return <ListItemText
            primary={cutString(item.buurtnaam2019, 20)}
            secondary={cutString(item.city, 18)}
        />
        case 'gemeente':
            return <ListItemText
            primary={cutString(item.gemeentenaam2019, 20)}
            secondary={cutString(item.city, 18)}
        />
        case 'wijk':
            return <ListItemText
            primary={cutString(item.wijknaam2019, 20)}
            secondary={cutString(item.city, 18)}
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

const fuseOptions = {
    shouldSort: true,
    threshold: 0.1,
    location: 0,
    distance: 1000,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "city",
      "gemeentenaam2019",
      "buurtnaam2019",
      "wijknaam2019",
    ]
  };

class ListView extends Component {

    state = {
        allItems: [],
        shownItems: [],
        searchTerm: ''
    }


    componentDidMount = async () => {
        let result = this.props.nationalData;
        console.log(result);
        

        this.setState({allItems: this.props.nationalData, shownItems: this.props.nationalData})
    }


    getItemIdentifier = (scope, index) => {
        switch(scope){
            case 'buurt':
                return this.state.shownItems[index].buurt2019;
            case 'gemeente':
                return this.state.shownItems[index].gemeente2019;
            case 'wijk':
                return this.state.shownItems[index].wijk2019;
            default:
                return "Error"
        }
    };


    handleSearch = (e) => {
        const currentItems = this.state.allItems;
        // const searchTerm = this.state.searchTerm;
        const searchTerm = e.target.value;
        console.log('searching:' +searchTerm);
        
        if(searchTerm){
            const fuse = new Fuse(currentItems, fuseOptions); // "list" is the item array
            const result = fuse.search(searchTerm);
            console.log(result);
            this.setState({shownItems: result});
        } else {
            this.setState({shownItems: this.state.allItems});
        }
    }

    handleSearchTermChange = (e) => {
        this.setState({searchTerm: e.target.value})
    }


    handleClick = (index) => {
        const identifier = this.getItemIdentifier(this.props.scope, index);

        this.props.selectListItem(identifier);
    }

    getRow = ({ index, style }) => {
        return <div style={style} >
            <ListItem key={index}  button onClick={() => this.handleClick(index)}>
                <ListItemAvatar >
                    <NeighbourhoodIcon />
                </ListItemAvatar>
                {getListItem(this.props.scope, this.state.shownItems[index])}
            </ListItem>
            <Divider variant="inset" />
        </div>
      };

    render() {
        const { classes } = this.props;
        return (
            <div style={{height: '100%'}}>
                <Grid container direction="column" justify="flex-start" style={{height: '100%'}}>
                <Grid item style={{height:'50px'}}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%'}} >
                            <Grid item style={{paddingTop: '10px', paddingLeft: '10px'}}><Typography variant="h6">{getListTitle(this.props.scope)}</Typography>
                            </Grid>
                            <Grid item >
                                <TextField size="small" id="outlined-basic" label="Search" variant="outlined" style={{width: '140px'}} onChange={this.handleSearch}/>
                                {/* <IconButton color="primary" aria-label="search" style={{marginTop:'-5px'}} onClick={this.handleSearch}>
                                    <SearchIcon />
                                </IconButton> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{ height: '85%'}}>
                        <AutoSizer>
                            {({ height, width }) => (
                            <FList
                                className="List"
                                height={height}
                                itemCount={this.state.shownItems.length}
                                itemSize={73}
                                width={width}
                            >
                                {this.getRow}
                            </FList>
                            )}
                    </AutoSizer>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(ListView);