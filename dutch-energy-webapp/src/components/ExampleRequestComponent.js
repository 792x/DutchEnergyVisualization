import React from 'react'
import fetch from 'node-fetch'

class ExampleRequestComponent extends React.Component {

    state={
        city: 'EINDHOVEN',
        last_city: '',
        result: '',
    };

    fetchCityData = async (city) => {
        await fetch('http://localhost:3001/annualcityconsumption?city=' + city)
            .then(res => res.json())
            //We should also check res.status to see if status code matches for error handling
            .then(json => {
                let annualCityConsumption = json.annual_city_consumption;
                this.setState({result: annualCityConsumption, last_city: city, city: ''})
            });
    };


    handleChange = (event) => {
        this.setState({city: event.target.value});
    };

    componentDidMount() {

    };

    render(){
        return(
            <div>
                <p>
                    Enter a city and click fetch to get its annual consumption!, city must be in caps..
                </p>
                <input type="text" value={this.state.city} onChange={this.handleChange} /> <button onClick={() => this.fetchCityData(this.state.city)}>Get!</button>

                {this.state.result ? <p>The annual consumption data for {this.state.last_city} is: {this.state.result}!</p> : <div />}
            </div>

        )
    };
}

export default ExampleRequestComponent