var express = require('express');
var fs = require('fs');
var csvParse = require('csv-parse');

var helpersRouter = express.Router();

var populationCsvPath = __dirname + '/../data/RUC11_LAD11_EN.csv';
var populationCsv;
var populationData;

// var parser = parse({delimiter: ';'}, function(err, data){
//   populationData = data;
// });

function enrichPopulation(callback) {
  csvParse(populationCsv, {columns: true}, function(err, data) {
    populationData = {};
    data.forEach(function(line) {
      console.log('line!', line);
      
      if (line.LAD11CD) {
        console.log('ID LAD11CD:', line.LAD11CD);
        populationData[line.LAD11CD] = {};
        populationData[line.LAD11CD].population = parseFloat(line[' Total population1'].replace(",",""));  
      }
    });
    console.log('Done with enrich!');
    callback();
  });
}

function parsePopulation(callback) {
  if (!populationCsv) {
    populationCsv = fs.readFileSync(populationCsvPath, 'utf8');
    if (!populationData) {
      enrichPopulation(callback);
    }
  } else {
    callback(null, populationData);
  }
}

helpersRouter.get('/population', function(req, res, next) {
  parsePopulation(function(err, data) {
    console.log('Returning the population');
    res.json(populationData);
  });
});

module.exports = helpersRouter;
