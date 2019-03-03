function buildMetadata(sample) {

  var url = "/metadata/" + sample;
  d3.json(url).then(function(sample) {
    var sample_metadata = d3.select ("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    
     Object.entries(sampl).forEach(([key, value])=>{
      var row = sample_metadata.append("p");
      row.text(`${key}:${value}`);

    });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    // https://plot.ly/javascript/bubble-charts/
    var xValues=data.otu_ids;
    var yValues=data.sample_values;
    var textValues=data.otu_labels;
    var markerSize=data.sample_values;
    var markerColors=data.otu_ids;

    // setting up trace as 'traceBubble'
    var traceBubble = {
      x:xValues,
      y:yValues,
      text:textValues,
      mode: 'markers',
      marker:{
        size:markerSize,
        color:markerColors
      }
    };

    var data=[traceBubble];
    var layout={
      xaxis:{title:"OUT ID"}
    };

    Plotly.newPlot('bubble',data,layout);
    
    // @TODO: Build a Pie Chart

    d3.json(url).then(function(data){
      var pieValues=data.sample_values.slice(0,10);
      var pieLabels=data.otu_ids.slice(0,10);
      var pieHovering=data.otu_labels.slice(0,10);

      var data = [{
        values:pieValues,
        labels:pieLabels,
        hovertext:pieHovering,
        type:'pie'
      }];

      Plotly.newPlot('pie',data);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Get new data whenever the dropdown selection changes
function getData(route) {
  console.log(route);
  d3.json(`/${route}`).then(function (data) {
    console.log("newdata", data);
    updatePlotly(data);
  });
}
// Initialize the dashboard
init()

buildMetadata();
