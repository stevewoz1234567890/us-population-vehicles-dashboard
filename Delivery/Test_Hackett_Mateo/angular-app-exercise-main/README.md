# Angular App Exercise

A small Angular application (one page only) that connects to a backend written in Python using [FastAPI](https://fastapi.tiangolo.com/), which in turn interacts with the datausa.io API. 

## Prerequisites
* Docker and Docker Compose
* ... and Python and [Angular CLI](https://cli.angular.io/) to develop
  stuff further.

## Running the app
To run the stack (FastAPI and Angular),
do the following:

1. Start the application from the root folder of this project with
   ```
   $ docker-compose up -d --build
   ```
   and give the stack a few moments to fire up. You can follow the logs
   with
   ```
   $ docker-compose -f logs
   ```
1. Open a browser and navigate to `http://localhost` for dashboard page. For API Docs open either `http://localhost:8081/docs` or `http://localhost:8081/redoc`  

## Approach

The Angular app is a simple one-page application that displays a list of states in the US and their respective populations. The data is fetched from the FastAPI backend, which in turn fetches the data from the datausa.io API. The Angular app is built using Angular CLI and the backend is built using FastAPI. The two are connected using Docker Compose.

## Implementation Details

Backend expose two endpoints:
1. `/api/v1/population` - GET request to fetch the list populations by states in the US. Target states passed as query parameter `targetStates` in the request. The API fetches the data from the datausa.io API and returns the filtered data.

2. `/api/v1/households` - GET request to fetch the households in the United States distributed among a series of car ownership buckets by years. Target years passed as query parameter `targetYears` in the request. The API fetches the data from the datausa.io API and returns the filtered data.

The Angular app fetches the data from the backend and displays it in a chart using the [ng2-charts](https://valor-software.com/ng2-charts/) (Angular directives for [Chart.js](https://www.chartjs.org/)). The chart displays the population of each state in the US. For now the filter is hardcoded to fetch the data (considering to make a dropdown to select the filter value). 

This app also responsive and can be viewed on mobile devices.

## Development

To develop further, you can run the Angular app and the FastAPI backend separately. To run the Angular app, navigate to the `client` folder and run
```
$ npm install
$ npm run start
```

To run the FastAPI backend, navigate to the `server` folder and run
```
$ source venv/bin/activate
$ pip install -r requirements.txt
$ uvicorn main:app --reload
```