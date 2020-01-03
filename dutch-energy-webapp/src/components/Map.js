import React, { Component } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { withStyles } from '@material-ui/core/styles';
// import wijk_2019_rd from '../assets/wijk_2019_rd.json';
const wijk_2019_wgs84 = require('../assets/wijk_2019_wgs84.json');
const buurt_2019_wgs84 = require('../assets/buurt_2019_wgs84.json');

const styles = theme => ({

});

const style = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 1
};

class Map extends Component {

    state = {

    }

    createMap =  () => {
        const map = L.map('map').setView([52.3667, 4.8945], 7);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox/light-v9'
        }).addTo(map);
        console.log(buurt_2019_wgs84);

        L.geoJSON(buurt_2019_wgs84, {
            style: style,
            onEachFeature: this.onEachFeature
        }).addTo(map);
    }

    onEachFeature = (feature, layer) => {
        layer.on({
            click: () => { this.handleClick(feature, layer)}
        });

        const popupContent = feature.properties.statcode;

        layer.bindPopup(popupContent);
    }

    handleClick = (feature, layer) => {
        //TODO
        console.log('click wijk: ',feature.properties.statcode)
    }

    componentDidMount = () => {
        this.createMap();
    }

    render() {
        const { classes } = this.props;

        return (
            <div id="map" style={{height: '100%'}} />
        )
    }
}

export default withStyles(styles)(Map);