require([
  'leaflet','jquery', 'topojson'
], function (L, $, topojson) {
  // http://charlesreid1.com/wiki/Leaflet_TopoJson
  L.TopoJSON = L.GeoJSON.extend({  
    addData: function(jsonData) {    
      if (jsonData.type === "Topology") {
        for (key in jsonData.objects) {
          geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }    
      else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }  
  });
  // Copyright (c) 2013 Ryan Clark

  var englishLdaMap = L.map('englishLdaMap').setView([51.505, -0.09], 5);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(englishLdaMap);

  var topoLayer = new L.TopoJSON();

  $.getJSON('data/lad.json')
    .done(addTopoData);
   
  function addTopoData(topoData){  
    topoLayer.addData(topoData);
    topoLayer.addTo(englishLdaMap);
  }

});
