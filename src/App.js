// React
import React, { useEffect, useState } from "react";

// Material-ui
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

// Components
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";

// CSS
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [inputCountry, setInputCountry] = useState("worldwide");

  // useEffect(() => {
  //   fetch("https://disease.sh/v3/covid-19/all")
  //     .then()
  // }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    // console.log(countryCode);

    setInputCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={inputCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={3000} total={2000} />
          <InfoBox title="Recovered" cases={3000} total={3000} />
          <InfoBox title="Deaths" cases={3000} total={4000} />
        </div>

        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <h3>Worldwide New Cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
