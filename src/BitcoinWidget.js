import React, { useState, useEffect as updateCounter } from "react";
import "./BitcoinWidget.css";
import { Line } from "react-chartjs-2";
import { animated, useSpring } from "react-spring";
import { initializeIcons } from "@uifabric/icons";
import { getIconClassName } from '@uifabric/styling';
initializeIcons(); // Initialise fabric UI icons

// As this is a small project, all components are kept in this single file for convenience

// Main widget component
function BitcoinWidget() {
  const [dark, setDark] = useState(false);
  const [smoothing, setSmoothing] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  return (
    <div className={(dark ? "dark " : "") + "btc-widget"}>
      <div className="btc-widget-header">
        Bitcoin Widget
        <i className={"dark-toggle " + getIconClassName(dark ? "Sunny" : "ClearNight")} onClick={() => setDark(!dark)} title={"Turn the lights " + (dark ? "on" : "off")} />
      </div>
      <div className="btc-widget-content">
        <BitcoinCounter currency="USD" />
        <BitcoinChart dark={dark} smoothing={smoothing} showLabels={showLabels} showLegend={showLegend} />
      </div>
      <div className="btc-widget-footer">
        <label htmlFor="showLabel">Show Labels: </label><input id="showLabel" type="checkbox" onChange={(e) => setShowLabels(e.target.checked)} />
        <label htmlFor="showLegend">Show Legend: </label><input id="showLegend" type="checkbox" onChange={(e) => setShowLegend(e.target.checked)} />
        <label htmlFor="smooth">Smoothing: </label><input id="smooth" type="checkbox" onChange={(e) => setSmoothing(e.target.checked)} />
      </div>
    </div>
  );
}

// Counter widget that displays the current bitcoin price
function BitcoinCounter(props) {
  const [spring, setSpring] = useSpring(() => ({number: 0})); // We use a spring for the number so it has a nice transition
  updateCounter(() => {
    fetchData(); // Initialise data from source
    setInterval(() => { 
      fetchData();
    }, 60 * 1000); // Update once every 60 seconds
  }, []); // We need this empty dependency array to ensure that the effect only runs once. ESlint complains about this. Oh well :(
  async function fetchData() {
    const response = await fetch("https://blockchain.info/ticker");
    const body = await response.json();
    if (response.status !== 200) { // Error
      throw Error(body.message);
    } else { // Success    
      setSpring({number: body[props.currency].last});
    }
  };
  return (
    <h2>
      Current Bitcoin Price: $<animated.span>{spring.number.interpolate((number) => number.toFixed(2))}</animated.span>
    </h2>
  );
}


// Chart widget that displays the daily bitcoin price over the past 30 days
function BitcoinChart(props) {
  const [data, setData] = useState([]); // Current chart data
  updateCounter(() => {
    updateChart(); // Initialise data from source
    setInterval(() => { 
      updateChart();
    }, 60 * 1000); // Update once every 60 seconds
  }, []);
  async function updateChart() {
    const response = await fetch("https://api.blockchain.info/charts/market-price?timespan=30days&cors=true");
    const body = await response.json();
    if (response.status !== 200) { // Error
      throw Error(body.message);
    } else { // Success
      let newData = [];
      for (let value of body.values) {
        newData.push({
          x: new Date(value.x * 1000), // Multiply by 1000 to convert to unix with milliseconds
          y: value.y.toFixed(2)
        });
      }
      setData(newData);
    }
  };
  return ( // The container element below prevents the chart loading from changing the shape of the window pane
    <div className="chart-container"> 
      { data.length > 1 && <Line data={{ // Only render the chart once there is data
          datasets: [{
            label: "Bitcoin Price (USD)",
            data: data,
            backgroundColor: props.dark ? "rgba(75, 192, 105, 0.2)" : "rgba(54, 162, 235, 0.2)",
            borderColor: props.dark ? "rgba(75, 192, 105, 1)" : "rgba(54, 162, 235, 1)",
            borderWidth: 1
          }]
        }} options={{
          legend: {
            display: props.showLegend,
            labels: {
              fontColor: props.dark ? "#ccc" : "#666"
            }
          },
          elements: {
            point: {
              hitRadius: 6 // Increased 'hit' radius for the data points so that they're not as fiddly to mouse over
            },
            line: {
              tension: props.smoothing ? 0.4 : 0.001 // Toggling to 0.01 instead of 0 for 'off' allows for easing / transitioning between the 2 states
            }
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: props.showLabels,
                labelString: "Date",
                fontColor: props.dark ? "#ccc" : "#666"
              },
              ticks: {
                fontColor: "#888" //These DON'T change once the chart has been initialised, so I have gone for a colour that is legible in both lighting modes
              },
              type: 'time', // Specify X axis as using date/time units
              gridLines: {
                drawOnChartArea: false // Remove horizontal grid lines
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: props.showLabels,
                labelString: "Price ($)",
                fontColor: props.dark ? "#ccc" : "#666"
              },
              ticks: {
                fontColor: "#888"
              }
            }]
          },
        }} />
      }
    </div>
  );
}

export default BitcoinWidget;
