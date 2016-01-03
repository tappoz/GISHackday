var width = 960,
    height = 1160;

// https://www.google.com/maps/place/55%C2%B024'00.0%22N+4%C2%B024'00.0%22W/@56.6764364,-11.6509763,5z/data=!4m2!3m1!1s0x0:0x0
// https://maps.google.com/maps?q=4.4%C2%B0W+55.4%C2%B0N&z=5
var latitudeCenter = 50.4;
var longitudeCenter = 4.4;

// projection details
var projection = d3.geo.albers()
    .center([0, latitudeCenter])
    .rotate([longitudeCenter, 0])
    .parallels([50, 60])
    .scale(1200 * 5)
    .translate([width / 2, height / 2]);
var path = d3.geo.path()
    .projection(projection);

// map canvas dimensions
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

d3.json("data/ldaEngland.json", function(error, ukTopoJson) {
  var topoJsonFeatures = topojson.feature(ukTopoJson, ukTopoJson.objects.lad);
  
  // counties as separate svg elements with their features
  var countyFill = '#333';
  svg
    .selectAll("path")
    .data(topoJsonFeatures.features)
  .enter()
    .append("path")
    .attr({
      'fill': countyFill,
      'stroke': 'green',
      'stroke-width': 1,
      'd': path
    })
    .on('mouseover', function(d) {
      svg
        .selectAll('path:hover')
        .attr({'fill': 'red'});

        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html("<b>LAD13NM: "+ d.properties.LAD13NM + "</b><br/>LAD13CDO: "+ d.properties.LAD13CDO);

        console.log('tooltip properties:', d.properties);
    })
    .on('mouseout', function(d) {
      console.log('return!');
      svg.selectAll('path').attr({'fill': countyFill});
      tooltip.classed("hidden", true);
    });
});
