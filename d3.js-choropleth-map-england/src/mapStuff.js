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

function getColor(valueIn, valuesIn) {
  var color = d3.scale.linear() // create a linear scale
    .domain([valuesIn[0],valuesIn[1]])  // input uses min and max values
    .range([.3,1]);   // output for opacity between .3 and 1 %
  return color(valueIn);  // return that number to the caller
}

function displayTooltip(d, displayData) {
  var htmlTooltip = '' 
              + "<b>LAD13NM: "+ d.properties.LAD13NM 
              + "</b><br/>LAD13CD: "+ d.properties.LAD13CD;
  if (displayData[d.properties.LAD13CD]) {
    htmlTooltip += "<br/>total population: " + displayData[d.properties.LAD13CD].toLocaleString();
    // TODO check why d.totalPopulation is undefined
    // htmlTooltip += "<br/>total population: " + d.totalPopulation.toLocaleString();
  } else {
    console.log('Strange data for d.properties ' + JSON.stringify(d.properties) 
      + ' and displayData ' + JSON.stringify(displayData[d.properties.LAD13CD]));
  }
  return htmlTooltip;
}

function dataAggregation(populationData) {
  var displayData = {};
  var totEnglishPopulation = 0;
  populationData.forEach(function(d) {
    var currentPopulation = parseFloat(d[' Total population1'].replace(",",""));
    displayData[d.LAD11CD] = currentPopulation;
    d.totalPopulation = currentPopulation;
    // TODO LDA polygon area
    // http://gis.stackexchange.com/questions/124853/converting-area-of-a-polygon-from-steradians-to-square-kilometers-using-d3-js
    if (NaN != currentPopulation)
      totEnglishPopulation += currentPopulation;
  });

  console.log('Total English population:', totEnglishPopulation);
  console.log('Returning aggregated:', displayData);
  return displayData;
}

d3.csv("data/RUC11_LAD11_EN.csv", function(error, populationData) {
  // transform all the string values to float numbers
  var displayData = dataAggregation(populationData);
  // console.log('Parsed CSV:', populationData);
  // console.log('Parsed population lookup:', displayData);

  // d3.min/d3.max functions are alternatives to the d3.extent function
  // var minPopulation = d3.min(populationData, function(d) { return d.totalPopulation; });
  // var maxPopulation = d3.max(populationData, function(d) { return d.totalPopulation; });
  // console.log('Evantual Min tot pop:',minPopulation);
  // console.log('Evantual Max tot pop:',maxPopulation);

  // min/max
  var extent = d3.extent(populationData, function(d, i) { return d.totalPopulation; });
  // console.log('Extent min/max:', extent);

  d3.json("data/ldaEngland.json", function(error, ukTopoJson) {
    var topoJsonFeatures = topojson.feature(ukTopoJson, ukTopoJson.objects.lad);
    console.log('TopoJSON:',topoJsonFeatures);
    
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
      .attr('fill-opacity', function(d) {
        var totLDAPop = displayData[d.properties.LAD13CD];
        // console.log('Current LDA:', JSON.stringify(d.properties));
        // console.log('Current LAD code:', d.properties.LAD13CD);
        // console.log('Current total population', totLDAPop);
        return getColor(totLDAPop, extent);  // give them an opacity value based on their current value
      })
      .on('mouseover', function(d) {
        svg
          .selectAll('path:hover')
          .attr({'fill': 'red'});

        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(displayTooltip(d, displayData));

          console.log('Tooltip properties:', d.properties);
          // TODO check why d.totalPopulation is undefined
          console.log('Tooltip totalPopulation:', d.totalPopulation);
      })
      .on('mouseout', function(d) {
        // console.log('Mouse out return!');
        svg.selectAll('path').attr({'fill': countyFill});
        tooltip.classed("hidden", true);
      });
  });
});
