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

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 5, attribution: osmAttrib}); 

  englishLdaMap.addLayer(osm);

  var topoLayer = new L.TopoJSON();

  $.getJSON('data/topo_lad.json')
    .done(function(topoLadData) {
      topoLayer.addData(topoLadData);
      topoLayer.addTo(englishLdaMap);
    });
});
