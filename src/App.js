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

      <div className="app__stats">//</div>
    </div>
  );
}

export default App;
