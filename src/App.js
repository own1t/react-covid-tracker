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
import Table from "./components/Table";
import LineChart from "./components/LineChart";

import { sortData, prettyPrintStat } from "./util";

// Numeral
import numeral from "numeral";

// CSS
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [inputCountry, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

  const [casesType, setCasesType] = useState("cases");

  // Table
  const [tableData, setTableData] = useState([]);

  // Map
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // Country Name
            value: country.countryInfo.iso2, // Country Code
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);

          // Map
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    // console.log(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);

        // Map
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  // console.log(countryInfo);

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
              {countries.map((country, idx) => (
                <MenuItem key={idx} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
          />

          <InfoBox
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
          />

          <InfoBox
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <div className="app__info">
            <h3>Live Cases by Country</h3>

            <Table countries={tableData} />

            <h3>Worldwide New {casesType}</h3>

            <LineChart casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
