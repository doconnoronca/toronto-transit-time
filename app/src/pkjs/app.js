Internet = require('./internet'); // Communication with back-ends
Watch    = require('./watch');    // Communication with watch
Geo      = require('./geo');      // Geolocation

// Import the Clay package
var Clay = require('@rebble/clay');
// Load our Clay configuration file
var clayConfig = require('./config');
// Initialize Clay
var clay = new Clay(clayConfig);

// Main events

Watch.addEventListener('ready', onPebbleReady);
Watch.addEventListener('route_selected', onRouteSelected);

function onPebbleReady(e) {
  openRoutesList();
};

function onRouteSelected(route) {
  openPredictions(route);
}

// Routes window flow

function openRoutesList() {
  Watch.displayTextFindingLocation();
  Geo.getCoordinates(onCoordinatesSuccess, onCoordinatesError);
};

function onCoordinatesSuccess(latitude, longitude) {
  Watch.displayTextFindingStops();

  Internet.getRoutes(latitude, longitude, onRoutesSuccess, onRoutesError);
};

function onRoutesSuccess(routes) {
  Watch.sendRoutes(routes);
};

// Predictions window flow

function openPredictions(route) {
  Internet.getPredictions(route.uri.replace("http://www.transsee.ca:8080/","https://www.transsee.ca/"), onPredictionsSuccess, onPredictionsError);
}

function onPredictionsSuccess(predictions) {
  Watch.sendPredictions(predictions);
}

// Error flows

function onCoordinatesError() {
  Watch.displayTextErrorLocation();
}

function onRoutesError() {
  Watch.displayTextErrorStops();
}

function onPredictionsError() {
  Watch.displayTextErrorPredictions();
}

