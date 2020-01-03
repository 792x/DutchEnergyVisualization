import React, { Component } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { withStyles } from '@material-ui/core/styles';
import LoadingSpinner from './LoadingSpinner';
// import wijk_2019_rd from '../assets/wijk_2019_rd.json';
const wijk_2019_wgs84 = require('../assets/wijk_2019_wgs84.json');
const gemeente_2019_wgs84 = require('../assets/gemeente_2019_wgs84.json');
const buurt_2019_wgs84 = require('../assets/buurt_2019_wgs84.json');

const styles = theme => ({

});

const style = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 1
};

function getGeoJson(scope){ 
    switch(scope){
        case 'buurt':
            return buurt_2019_wgs84;
        case 'wijk':
            return wijk_2019_wgs84;
        case 'gemeente':
            return gemeente_2019_wgs84;
        default:
            return buurt_2019_wgs84;
    }
}



class Map extends Component {

    state = {
    }

    createMap =  async (scope) => {
        this.map = L.map('map').setView([52.3667, 4.8945], 7);
        let geojson = getGeoJson(scope);
        
        const titleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox/light-v9'
        }).addTo(this.map);
        console.log(geojson);

        this.customLayer = L.geoJSON(geojson, {
            style: style,
            onEachFeature: this.onEachFeature
        })

        this.map.addLayer(titleLayer);
        this.map.addLayer(this.customLayer);
    }

    updateMap = async (scope) => {
        let geojson = getGeoJson(scope);

        this.map.removeLayer(this.customLayer);

        this.customLayer = L.geoJSON(geojson, {
            style: style,
            onEachFeature: this.onEachFeature
        })

        this.map.addLayer(this.customLayer);
    }

    delayHelper = ms => new Promise(res => setTimeout(res, ms));

    onEachFeature = (feature, layer) => {
        layer.on({
            click: () => { this.handleClick(feature, layer)}
        });

        const popupContent = feature.properties.statcode;

        layer.bindPopup(popupContent);
    }

    handleClick = async (feature, layer) => {
        //TODO
        //Remove 'leading BU'
        //Remove leading 0 if exists
        await this.delayHelper(2000);
        console.log('yeet')
        console.log('click wijk: ',feature.properties.statcode)
    }

    componentDidMount = async () => {
        console.log('mounted', this.props.scope);
        this.createMap(this.props.scope);
        
    }

    componentDidUpdate = async () => {
        console.log('mounted', this.props.scope);
        this.updateMap(this.props.scope);
    }

    render() {
        const { classes } = this.props;

        return (
            <div id="map" style={{height: '100%'}} />
        )
    }
}

export default withStyles(styles)(Map);