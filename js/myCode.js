require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/SpatialReference",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/geometry/geometryEngine",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "dojo/domReady!"
], function(
      Map, 
      SceneView, 
      GraphicsLayer, 
      Graphic, 
      SpatialReference, 
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      geometryEngine,
      Point,
      Polyline
    ) {

  var map = new Map({
    basemap: "satellite"
  });

  var view3d = new SceneView({
    container: "viewDiv",
    map: map,
    zoom: 5,
    center: [0, 45]
  });

  map.then(function(){
    //The map's resources have loaded. Now the layers and basemap can be accessed
    console.log('All good with the map creation!');

    var pointSym = helpers.newPointDecorator();
    var geoStructures = helpers.populatePoints(pointSym);
    var bufferLayer = geoStructures.buffer;
    var pointLayer = geoStructures.points;
    var polylineLayer = geoStructures.polyline;

    map.add([bufferLayer, pointLayer, polylineLayer]).then(function() {
      console.log('All good with the data loaded on the map!');
    });

  }, function(error){
    //Use the errback function to handle when the map doesn't load properly
    console.log("The map's resources failed to load: ", error);
  });

  var helpers = {};

  // this function returns a new point in the ESRI format
  helpers.newPoint = function(lat, lng, spatialReference) {
    var pointOptions = {x: lng, y: lat, spatialReference: spatialReference};
    var newPoint = new Point(pointOptions);
    return newPoint;
  };

  // this function returns a new polyline (a list of connected points)
  // in the ESRI format, it requires the points to be in the ESRI format as well
  helpers.newPolyline = function(esriPointsArray, spatialReference) {
    var newPolyline = new Polyline(spatialReference);
    newPolyline.addPath(esriPointsArray);
    return newPolyline;
  }

  // this function returns a decorator for a point e.g. colors, size of the point etc.
  helpers.newPointDecorator = function() {
    var lineSymbolOptions = {color: [255, 255, 255], width: 1};
    var newLineSymbol = new SimpleLineSymbol(lineSymbolOptions);
    var markerSymbolOptions = {color: [255, 0, 0], outline: newLineSymbol, size: 10};
    var pointSym = new SimpleMarkerSymbol(markerSymbolOptions);

    return pointSym;
  };

  // this function returns a decorator for a polyline e.g. colors, width of the line etc.
  helpers.newPolylineDecorator = function() {
    var lineSymbolOptions = {color: [255, 0, 0], width: 5};
    var newLineSymbol = new SimpleLineSymbol(lineSymbolOptions);
    return newLineSymbol;
  };

  // this function returns a Graphic object (defined in the ESRI format)
  // it needs in input a geometry that could be a new point, or a new polyline etc.
  helpers.newGraphic = function(geometry, symbol) {
    var geometryOptions = {geometry: geometry, symbol: symbol};
    var newGraphic = new Graphic(geometryOptions);
    return newGraphic;
  };

  // this is where all happens, for simplicity the <latitude,longitude> pairs 
  // are generated with a for loop programmatically
  helpers.populatePoints = function(pointSym) {
    
    var lng = 0;
    var minLat = 40;
    var maxLat = 50;

    var wgs84 = 4326;
    var sr = new SpatialReference(wgs84);

    // points / buffer
    var pointLayer = new GraphicsLayer();
    var bufferLayer = new GraphicsLayer();
    var esriPointsArray = [];
    for (var lat = minLat; lat <= maxLat; lat +=1) {
      var newPoint = helpers.newPoint(lat, lng, sr);
      pointLayer = helpers.populatePointItem(pointLayer, newPoint, pointSym);
      bufferLayer = helpers.populateBufferItem(bufferLayer, newPoint, geometryEngine);
      esriPointsArray.push(newPoint);
    };

    // polyline (should represent an airplane path)
    var polyline = helpers.newPolyline(esriPointsArray, sr);
    var polylineDecorator = helpers.newPolylineDecorator();
    var polylineLayer = helpers.populatePolylineItem(polyline, polylineDecorator);

    // thunderstorm point
    var thunderstormPoint = helpers.newThunderstormPoint(sr);
    pointLayer = helpers.populatePointItem(pointLayer, thunderstormPoint, pointSym);

    return {points: pointLayer, buffer: bufferLayer, polyline: polylineLayer};
  };

  // this function simulates the generation of a thunderstorm point
  helpers.newThunderstormPoint = function(spatialReference) {
    var lat = 48;
    var lng = -5;
    var thunderstormPoint = helpers.newPoint(lat, lng, spatialReference);
    return thunderstormPoint;
  };

  // this function updates a layer (provided in the ESRI format) 
  // adding a point (also in the ESRI format) decorated with symbols 
  // (also compliant with the ESRI format)
  helpers.populatePointItem = function(pointLayer, point, pointSym) {
    pointLayer.add(helpers.newGraphic(point, pointSym));
    return pointLayer;
  };

  // this function updates a buffer layer (ESRI terminology)
  helpers.populateBufferItem = function(bufferLayer, point, geometryEngine) {
    var distanceAmount = 560;
    var distanceUnit = "kilometers";
    var buffer = geometryEngine.geodesicBuffer(point, distanceAmount, distanceUnit);
    bufferLayer.add(helpers.newGraphic(buffer /* , polySym */));
    return bufferLayer;
  };

  // this function updates a polyline layer adding the information comiing from a polyline object
  helpers.populatePolylineItem = function(polyline, polylineStyler) {
    var polylineLayer = new GraphicsLayer();
    polylineLayer.add(helpers.newGraphic(polyline, polylineStyler));
    return polylineLayer;
  };


});