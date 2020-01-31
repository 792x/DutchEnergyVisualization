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
        data: {}
    }

    createMap =  async (scope) => {
        this.map = L.map('map').setView([52.3667, 4.8945], 7);
        let geojson = getGeoJson(scope);
        
        const titleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox/light-v9'
        }).addTo(this.map);

        this.customLayer = L.geoJSON(geojson, {
            style: this.styleEachFeature,
            onEachFeature: this.onEachFeature
        })



        this.map.addLayer(titleLayer);
        this.map.addLayer(this.customLayer);
    }

    updateMap = async (scope) => {
        let geojson = getGeoJson(scope);

        this.map.removeLayer(this.customLayer);

        this.customLayer = L.geoJSON(geojson, {
            style: this.styleEachFeature,
            onEachFeature: this.onEachFeature
        })

        this.map.addLayer(this.customLayer);
    }

    parseIdentifier = (input) => {
        //remove non numerics
        let part1 = input.replace(/\D/g,'');
        let part2 = part1.replace(/^0+/, '');
        
        return part2;

    }

    delayHelper = ms => new Promise(res => setTimeout(res, ms));

    getColor = (percent, start, end) => {
            var a = percent / 100,
                b = (end - start) * a,
                c = b + start;
          
            // Return a CSS HSL string
            return 'hsl('+c+', 100%, 50%)';
          
          //Change the start and end values to reflect the hue map
          //Refernece : http://www.ncl.ucar.edu/Applications/Images/colormap_6_3_lg.png
          
          /*
          Quick ref:
              0 – red
              60 – yellow
              120 – green
              180 – turquoise
              240 – blue
              300 – pink
              360 – red
          */    
    }
    styleEachFeature = (feature, layer) => {
        // return {color: "#ff0000"};
        let style  = {
            "color": "#B8B8B8",
            "weight": 1,
            "opacity": 1,
            "fillOpacity": 0.75
        };
        feature.properties.identifier = this.parseIdentifier(feature.properties.statcode);

        if(this.props.nationalData){
            const data = this.props.nationalData[feature.properties.identifier];
            if(data) {
                console.log(data);
                const perc = data.annual_consume_color;
                //TODO: change depending on setting
                style = {
                        "color": this.getColor(perc, 60, 0),
                        "weight": 1,
                        "opacity": 0.75,
                        "fillOpacity": 0.75
                    };
            }
        }
        return style;
    }

    onEachFeature = (feature, layer) => {
        // layer.on({
        //     click: () => { this.handleClick(feature, layer)}
        // });
        // console.log(feature, layer);

        
        
        let popupContent  =`<p>Loading...</p>`;
        feature.properties.identifier = this.parseIdentifier(feature.properties.statcode);

        if(this.props.nationalData){
            const data = this.props.nationalData[feature.properties.identifier];
            if(data) {
                switch(this.props.scope){
                    case 'buurt':
                        popupContent  =`<p>Buurt: ${data.buurtnaam2019}</p><p>Wijk: ${data.wijknaam2019}</p><p>Gemeente: ${data.gemeentenaam2019}</p>
                        <button id="button-explore-${feature.properties.identifier}" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary type="button">Explore</button>`;
                        break;
                    case 'wijk':
                        popupContent  =`<p>Wijk: ${data.wijknaam2019}</p><p>Gemeente: ${data.gemeentenaam2019}</p>
                        <button id="button-explore-${feature.properties.identifier}" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary type="button">Explore</button>`;
                        break;
                    case 'gemeente':
                        popupContent  =`<p>Gemeente: ${data.gemeentenaam2019}</p>
                        <button id="button-explore-${feature.properties.identifier}" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary type="button">Explore</button>`;
                        break;
                    default:
                        popupContent  =`<p>No data.</p>`;
                        break;
                }
            } else {
                popupContent  =`<p>No data.</p>`
            }
        }
        
        //TODO fix no data popup crash
        layer.bindPopup(popupContent).on("popupopen", (e) => {
            if(this.props.nationalData && feature.properties.identifier){
                L.DomEvent.addListener(L.DomUtil.get(`button-explore-${feature.properties.identifier}`), 'click', (e) => {
                    console.log('clicked explore!')
                    const identifier = feature.properties.identifier;
                    this.props.selectItem(identifier);
                  });
            }
          });
    }

    openMarkerPopup = (id) => {
        this.customLayer.eachLayer((feature) => {
            if(feature.feature.properties.identifier === id){
                feature.openPopup();
            }
        });
    }


    componentDidMount = async () => {
        this.state.data = this.props.nationalData;
        this.createMap(this.props.scope);
        // geoJson.getLayer(layerId).openPopup()
    }

    componentDidUpdate = async () => {
        this.updateMap(this.props.scope);
        this.openMarkerPopup(this.props.selectedListItem);
    }

    render() {
        const { classes } = this.props;

        return (
            <div id="map" style={{height: '100%'}} />
        )
    }
}

export default withStyles(styles)(Map);