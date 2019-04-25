'use strict';

let neighborhoods = [];

function Neighborhood (rawDataObject) {
  for(let key in rawDataObject){
    this[key] = rawDataObject[key];
  }
}

Neighborhood.prototype.toHtml = function() {
  // 1. Get the template from the HTML document
  let source = $('#neighborhood-template').html();
  // 2. Use Handlebars to "compile" the HTML
  let template = Handlebars.compile(source);
  // 3. Do not forget to return the HTML from this method
  return template(this);
};

neighborhoodDataSet.forEach(neighborhoodObject => {
  neighborhoods.push(new Neighborhood(neighborhoodObject));
});

neighborhoods.forEach(ourNewNeighborhoodObject => {
  $('#neighborhoods').append(ourNewNeighborhoodObject.toHtml());
});
