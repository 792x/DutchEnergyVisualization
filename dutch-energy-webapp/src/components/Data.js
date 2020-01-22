import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, FormLabel, FormControl, Select, InputLabel, StylesProvider } from '@material-ui/core';
import { select, selectAll } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { transition } from 'd3-transition';


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

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const BarChart = (props) => {
    let data = props.data;
    // let data = [{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2010,"annual_consume":12810631,"num_connections":213256.59000000003,"annual_consume_lowtarif_perc":28.148273280299502,"delivery_perc":23.44969583528311,"perc_of_active_connections":95.70577912962096},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2011,"annual_consume":12895120,"num_connections":214063.18,"annual_consume_lowtarif_perc":37.289342963653326,"delivery_perc":23.729263746505126,"perc_of_active_connections":94.98120223671953},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2012,"annual_consume":13043705,"num_connections":217198.76999999996,"annual_consume_lowtarif_perc":36.71281321707205,"delivery_perc":23.960991280403857,"perc_of_active_connections":94.4426801284994},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2013,"annual_consume":12985893,"num_connections":218299.08,"annual_consume_lowtarif_perc":38.241359090909114,"delivery_perc":24.23090909090909,"perc_of_active_connections":94.34410000000005},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2014,"annual_consume":13089935,"num_connections":214704.85000000015,"annual_consume_lowtarif_perc":41.40243572395131,"delivery_perc":24.377988272440234,"perc_of_active_connections":92.52147045557066},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2015,"annual_consume":12742139,"num_connections":214750.5500000001,"annual_consume_lowtarif_perc":42.371878354203936,"delivery_perc":24.544722719141323,"perc_of_active_connections":92.29016100178893},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2016,"annual_consume":12657636,"num_connections":212930.74000000005,"annual_consume_lowtarif_perc":47.42520870337478,"delivery_perc":24.763765541740675,"perc_of_active_connections":92.23470248667857},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2017,"annual_consume":12455475,"num_connections":211364.1100000001,"annual_consume_lowtarif_perc":49.94710584101893,"delivery_perc":24.869565217391305,"perc_of_active_connections":92.09200263504616},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2018,"annual_consume":12322749,"num_connections":209890.86000000007,"annual_consume_lowtarif_perc":52.24220965637232,"delivery_perc":25.09264897781644,"perc_of_active_connections":91.71953458025234},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2019,"annual_consume":12647690,"num_connections":211544.09,"annual_consume_lowtarif_perc":28.44419735599622,"delivery_perc":23.272426817752596,"perc_of_active_connections":96.15531633616624}];
    if (data !== null) {
        data = data.map((d) => {
            var d2 = {};
            d2.year = d.year;
            d2.annual_consume = (d.annual_consume / 1000000).toFixed(2);
            return d2;
        });

        const max = Math.max.apply(Math, data.map(function(d) { return d.annual_consume; }));
        const svg = select('#svg-1');
        const svgContainer = select('#container');

        svg.selectAll("*")
        .remove();
        
        const margin = props.settings.margin;
        const width = props.settings.width - 2 * margin;
        const height = props.settings.height - 2 * margin;

        const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

        const xScale = scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.year))
        .padding(0.4);
        
        const yScale = scaleLinear()
        .range([height, 0])
        .domain([0, Math.floor(max) + 2]);

        const makeYLines = () => axisLeft()
        .scale(yScale);

        chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(axisBottom(xScale));

        chart.append('g')
        .call(axisLeft(yScale));

        chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        );

        const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g');

        barGroups.append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.year))
        .attr('y', (g) => yScale(g.annual_consume))
        .attr('height', (g) => height - yScale(g.annual_consume))
        .attr('width', xScale.bandwidth());

        barGroups.append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.annual_consume) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.annual_consume}`);
        
        svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Electricity (*10^6)');

        svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Year');

        svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Annual consumption of Electricity');
    }

    return (
        <div id="svg-container" style={{ height: '400px', width: '600px', backgroundColor: '#2F4A6D' }}>
            <svg className="svg-d3" id="svg-1" style={{ height: '100%', width: '100%' }} />
        </div>
    )
}

const LineChart = (props) => {
    let data = props.data;
    // let data = [{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2010,"annual_consume":12810631,"num_connections":213256.59000000003,"annual_consume_lowtarif_perc":28.148273280299502,"delivery_perc":23.44969583528311,"perc_of_active_connections":95.70577912962096},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2011,"annual_consume":12895120,"num_connections":214063.18,"annual_consume_lowtarif_perc":37.289342963653326,"delivery_perc":23.729263746505126,"perc_of_active_connections":94.98120223671953},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2012,"annual_consume":13043705,"num_connections":217198.76999999996,"annual_consume_lowtarif_perc":36.71281321707205,"delivery_perc":23.960991280403857,"perc_of_active_connections":94.4426801284994},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2013,"annual_consume":12985893,"num_connections":218299.08,"annual_consume_lowtarif_perc":38.241359090909114,"delivery_perc":24.23090909090909,"perc_of_active_connections":94.34410000000005},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2014,"annual_consume":13089935,"num_connections":214704.85000000015,"annual_consume_lowtarif_perc":41.40243572395131,"delivery_perc":24.377988272440234,"perc_of_active_connections":92.52147045557066},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2015,"annual_consume":12742139,"num_connections":214750.5500000001,"annual_consume_lowtarif_perc":42.371878354203936,"delivery_perc":24.544722719141323,"perc_of_active_connections":92.29016100178893},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2016,"annual_consume":12657636,"num_connections":212930.74000000005,"annual_consume_lowtarif_perc":47.42520870337478,"delivery_perc":24.763765541740675,"perc_of_active_connections":92.23470248667857},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2017,"annual_consume":12455475,"num_connections":211364.1100000001,"annual_consume_lowtarif_perc":49.94710584101893,"delivery_perc":24.869565217391305,"perc_of_active_connections":92.09200263504616},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2018,"annual_consume":12322749,"num_connections":209890.86000000007,"annual_consume_lowtarif_perc":52.24220965637232,"delivery_perc":25.09264897781644,"perc_of_active_connections":91.71953458025234},{"gemeente2019":"228","gemeentenaam2019":"Ede","year":2019,"annual_consume":12647690,"num_connections":211544.09,"annual_consume_lowtarif_perc":28.44419735599622,"delivery_perc":23.272426817752596,"perc_of_active_connections":96.15531633616624}];
    if (data !== null) {
        data = data.map((d) => {
            var d2 = {};
            d2.year = d.year;
            d2.annual_consume = (d.annual_consume / 1000000).toFixed(2);
            return d2;
        });

        const max = Math.max.apply(Math, data.map(function(d) { return d.annual_consume; }));
        const svg = selectAll('#svg-2');
        const svgContainer = select('#container');

        svg.selectAll("*")
        .remove();
        
        const margin = props.settings.margin;
        const width = props.settings.width - 2 * margin;
        const height = props.settings.height - 2 * margin;

        const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

        const xScale = scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.year))
        .padding(0.4);
        
        const yScale = scaleLinear()
        .range([height, 0])
        .domain([0, Math.floor(max) + 2]);

        const makeYLines = () => axisLeft()
        .scale(yScale);

        chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(axisBottom(xScale));

        chart.append('g')
        .call(axisLeft(yScale));

        chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        );

        chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line()
            .x(function(d) { return xScale(d.year) })
            .y(function(d) { return yScale(d.annual_consume) })
        );
        
        svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Electricity (*10^6)');

        svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Year');

        svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Annual consumption of Electricity');
    }

    return (
        <div id="svg-container" style={{ height: '400px', width: '600px', backgroundColor: '#2F4A6D' }}>
            <svg className="svg-d3" id="svg-2" style={{ height: '100%', width: '100%' }} />
        </div>
    )
}

const SelectedItem = (props) => {
    let selected = {};
    if (props.specificData) {
        switch (props.scope) {
            case 'gemeente':
                selected.gemeente = props.specificData[0].gemeentenaam2019;
                break;

            case 'wijk':
                selected.gemeente = props.specificData[0].gemeentenaam2019;
                selected.wijk = props.specificData[0].wijknaam2019;
                break;

            case 'buurt':
                selected.gemeente = props.specificData[0].gemeentenaam2019;
                selected.wijk = props.specificData[0].wijknaam2019;
                selected.buurt = props.specificData[0].buurtnaam2019;
                break;
        }
    } else {
        selected.gemeente = '...';
    }

    if (selected.buurt) {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>, Wijk: <strong>{selected.wijk}</strong>, Buurt: <strong>{selected.buurt}</strong>
            </Typography>
        )
    } else if (selected.wijk) {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>, Wijk: <strong>{selected.wijk}</strong>
            </Typography>
        )
    } else {
        return (
            <Typography variant="h6">
                Gemeente: <strong>{selected.gemeente}</strong>
            </Typography>
        )
    }
}


class Data extends Component {

    state = {
        loading: false,
        energySourceSetting: 'electricity',
        chartTypeSetting: 1,
        timeframeSetting: '2019',
    }

    handleTimeFrameSettingChange = (e) => {
        this.setState({ timeframeSetting: e.target.value });
        console.log(e.target.value);
    }

    handleChartTypeSettingChange = (e) => {
        this.setState({ chartTypeSetting: e.target.value });
        console.log(e.target.value);
    }

    handleEnergySourceSettingChange = (e) => {
        this.setState({ energySourceSetting: e.target.value });
        console.log(e.target.value);
    }


    render() {
        const { classes } = this.props;
        
        const graphSettings = {
            width: 600,
            height: 400,
            margin: 60,
        };

        return (
            <div className={classes.root}>
                <Grid container direction="column" justify="flex-start" style={{ height: '100%' }}>
                    <Grid item style={{ height: '48px' }}>
                        <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '48px' }} >
                            <Grid item style={{ marginTop: '10px', marginLeft: '10px' }}>
                                <SelectedItem scope={this.props.scope} specificData={this.props.specificData}></SelectedItem>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item style={{ paddingRight: '20px', width: '150px' }} >
                                        <FormControl className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Energy Source
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.energySourceSetting}
                                                onChange={this.handleEnergySourceSettingChange}
                                            >
                                                <option value={'electricity'}>Electricity</option>
                                                <option value={'gas'}>Gas</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item style={{ paddingRight: '20px' }}>
                                        <FormControl >
                                            <InputLabel htmlFor="outlined-age-native-simple">
                                                Timeframe
                                            </InputLabel>
                                            <Select
                                                native
                                                value={this.state.timeframeSetting}
                                                onChange={this.handleTimeFrameSettingChange}
                                            >
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
                                                value={this.state.chartTypeSetting}
                                                onChange={this.handleChartTypeSettingChange}
                                            >
                                                <option value={1}>Trends</option>
                                                <option value={2}>Bar charts</option>
                                                <option value={3}>Pie charts</option>
                                                <option value={4}>Distributions</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="space-between" style={{ width: '100%', height: '48px', marginTop: '20px' }} >
                        <Grid item style={{ marginLeft: '10px' }}>
                            <BarChart data={this.props.specificData} settings={graphSettings}></BarChart>
                        </Grid>

                        <Grid item style={{ marginLeft: '10px' }}>
                            <LineChart data={this.props.specificData} settings={graphSettings}></LineChart>
                        </Grid>

                        <Grid item style={{ marginLeft: '10px' }}>
                            <LineChart data={this.props.specificData} settings={graphSettings}></LineChart>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Data);

