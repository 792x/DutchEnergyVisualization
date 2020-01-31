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

function getProviderColor(provider){
    if(provider.includes('Liander')){
        return '#0c2c84';
    } else if (provider.includes('Enexis')){
        return '#005a32';
    } else if(provider.includes('8716')) {
        return '#F3D800';
    }
}


function getColor(d, colorSetting) {

    switch(colorSetting){
        case '1':
            //red
            return d > 87.5 ? '#800026' :
            d > 75          ? '#BD0026' :
            d > 62.5        ? '#E31A1C' :
            d > 50          ? '#FC4E2A' :
            d > 37.5        ? '#FD8D3C' :
            d > 25          ? '#FEB24C' :
            d > 12.5        ? '#FED976' :
                            '#FFEDA0';

        case '2':
            //green
            return d > 87.5 ? '#005a32':
            d > 75          ? '#238b45':
            d > 62.5        ? '#41ab5d':
            d > 50          ? '#78c679':
            d > 37.5        ? '#addd8e':
            d > 25          ? '#d9f0a3':
            d > 12.5        ? '#f7fcb9':
                            '#ffffe5';

        case '3':
            //blue
            return d > 87.5 ? '#0c2c84':
            d > 75          ? '#225ea8':
            d > 62.5        ? '#1d91c0':
            d > 50          ? '#41b6c4':
            d > 37.5        ? '#7fcdbb':
            d > 25          ? '#c7e9b4':
            d > 12.5        ? '#edf8b1':
                            '#ffffd9';

        case '4':
            //purple
            return d > 87.5 ? '#7a0177':
            d > 75          ? '#ae017e':
            d > 62.5        ? '#dd3497':
            d > 50          ? '#f768a1':
            d > 37.5        ? '#fa9fb5':
            d > 25          ? '#fcc5c0':
            d > 12.5        ? '#fde0dd':
                            '#fff7f3';

        default:
            return d > 87.5 ? '#800026' :
            d > 75  ? '#BD0026' :
            d > 62.5  ? '#E31A1C' :
            d > 50  ? '#FC4E2A' :
            d > 37.5   ? '#FD8D3C' :
            d > 25   ? '#FEB24C' :
            d > 12.5   ? '#FED976' :
                        '#FFEDA0';



    }

}


class Map extends Component {

    state = {
        data: {},
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


        this.legend = L.control({position: 'bottomright'});
        let colorSetting = this.props.mapColorSetting;

        this.legend.onAdd = function (map) {
        
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5];
        
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1, colorSetting) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
            return div;
        };
        
        this.legend.addTo(this.map);

        this.map.addLayer(titleLayer);
        this.map.addLayer(this.customLayer);
    }

    updateMap = async (scope) => {
        let geojson = getGeoJson(scope);

        this.map.removeLayer(this.customLayer);
        this.map.removeControl(this.legend);

        let colorSetting = this.props.mapColorSetting;


        if(this.props.mapDataSetting === '7'){
            this.legend.onAdd = function (map) {
        
                var div = L.DomUtil.create('div', 'info legend');
            
                // loop through our density intervals and generate a label with a colored square for each interval
                div.innerHTML += '<p style="font-size:10px; line-height: 1;">Provider</p>';
                div.innerHTML +='<i style="background:' + getProviderColor('Enexis') + '"></i> Enexis <br>' + 
                '<i style="background:' + getProviderColor('Liander') + '"></i> Liander <br>' +
                '<i style="background:' + getProviderColor('8716') + '"></i> Stendin <br>';
            
                return div;
            };
        } else {
            this.legend.onAdd = function (map) {
        
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5],
                    labels = [];
            
                // loop through our density intervals and generate a label with a colored square for each interval
                div.innerHTML += '<p style="font-size:10px; line-height: 1;">Standardized <br> magnitude</p>';
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1, colorSetting) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '-100');
                }
            
                return div;
            };
        }

        
        this.legend.addTo(this.map);

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
            let data;

            switch(this.props.scope){
                case 'gemeente':
                    data = this.props.nationalData.find(({ gemeente2019 }) => gemeente2019 === feature.properties.identifier);
                    break;
                case 'wijk':
                    data = this.props.nationalData.find(({ wijk2019 }) => wijk2019 === feature.properties.identifier);
                    break;
                case 'buurt':
                    data = this.props.nationalData.find(({ buurt2019 }) => buurt2019 === feature.properties.identifier);
                    break;
                default:
                    console.log('error something went wrong HIT DEFAULT CASE');
                    data = {};
            }

            //  const data = this.props.nationalData[feature.properties.identifier];
            if(data) {
                let perc;
                let marketShare = false;
                switch(this.props.mapDataSetting){
                    case '1':
                        perc = data.annual_consume_color;
                        break;
                    case '2':
                        perc = data.annual_consume_lowtarif_perc_color;
                        break;
                    case '3':
                        perc = data.smartmeter_perc_color;
                        break;
                    case '4':
                        perc = data.num_connections_color;
                        break;
                    case '5':
                        perc = data.perc_of_active_connections_color;
                        break;
                    case '6':
                        perc = data.delivery_perc_color;
                        break;
                    case '7':
                        marketShare = true;
                        break;
                    default:
                        console.log('error in switch this.props.mapDataSetting');
                }

                if(!marketShare){
                    style = {
                        "color": getColor(perc, this.props.mapColorSetting),
                        "weight": 1,
                        "opacity": 0.75,
                        "fillOpacity": 0.75
                    };
                } else {
                    style = {
                        "color": getProviderColor(data.net_manager),
                        "weight": 1,
                        "opacity": 0.75,
                        "fillOpacity": 0.75
                    };
                } 
            }
        }
        return style;
    }

    onEachFeature = (feature, layer) => {     
        let popupContent  =`<p>Loading...</p>`;
        feature.properties.identifier = this.parseIdentifier(feature.properties.statcode);
        let data;
        if(this.props.nationalData){
            
            switch(this.props.scope){
                case 'gemeente':
                    data = this.props.nationalData.find(({ gemeente2019 }) => gemeente2019 === feature.properties.identifier);
                    break;
                case 'wijk':
                    data = this.props.nationalData.find(({ wijk2019 }) => wijk2019 === feature.properties.identifier);
                    break;
                case 'buurt':
                    data = this.props.nationalData.find(({ buurt2019 }) => buurt2019 === feature.properties.identifier);
                    break;
                default:
                    console.log('error something went wrong HIT DEFAULT CASE');
                    data = {};
            }

            // const data = this.props.nationalData[feature.properties.identifier];
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
            if(this.props.nationalData && data){
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