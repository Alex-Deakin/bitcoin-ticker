## Features

* A live bitcoin price that polls for updates once per minute (the API data updates every minute or so)
* A chart that displays the bitcoin price per day over the last 30 days
* Toggles for chart labels, legend, and line smoothing / beziers
* A dark mode!

Note: all prices are in USD because the free API functionality I am using for this doesn't fully support other currencies such as GBP

## How to Install

In the project directory, run:

### 'npm install'

This will install all of the necessary node packages to run the widget.

Once the installation is complete, run:

### 'npm run start'

(In the project directory.)

This will start the widget.

## Miscellaneous

The following packages were used in this project:

* [create-react-app](https://github.com/facebook/create-react-app) - for the skeleton
* [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2) - a react wrapper for Chart.js; the library used for the bitcoin chart
* [react-spring](https://github.com/react-spring/react-spring) - for animations and easing

The API data source I used in this project is kindly hosted free of charge by [https://www.blockchain.com](https://www.blockchain.com).
