function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleChosen = samples.filter(sampleObj => sampleObj.id == sample);
    var sampleResult = sampleChosen[0];
    //console.log(sampleResult);

    //metadata array for chosen sample
    var metadata = data.metadata;
    var metadataChosen = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaResult = metadataChosen[0];
    //console.log(metadataChosen);
    //console.log(metaResult);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample =samples[0];
    //console.log(firstSample);

    // First sample in metadata array
    var firstMeta = metadata[0]
    //console.log(firstMeta)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values = sampleChosen.map(sample => sample.sample_values);
    var otu_ids = sampleChosen.map(sample => sample.otu_ids);
    var otu_labels = sampleChosen.map(sample => sample.otu_labels);
    //console.log(otu_ids[0]);

    // Variable for washing frequency
    var wFreq = metadataChosen.map(sample => sample.wfreq);
    var washFreq = parseFloat(wFreq);

    //console.log(washFreq);

    // 7. Create the yticks for the bar chart.

    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    
    ids = otu_ids[0].slice(0,10).reverse()
    y = ids.map(id => 'otu '+id)
    x = sample_values[0].slice(0,10).reverse()
    text = otu_labels[0].slice(0,10).reverse()
   
  
    // 8. Create the trace for the bar chart.

    var barData = [{
      x: x,
      y: y,
      text: text,
      type: "bar",
      orientation: "h"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Species Present",
      width: 420,
      height: 380
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids[0],
      y: sample_values[0],
      mode: "markers",
      marker: {
        color: otu_ids[0],
        size: sample_values[0]
      },
      text: otu_labels[0],

    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      height: 450,
      width: 1000
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,10]},
          bar: { color: "black"},
          steps: [
            { range: [0,2], color: "red"},
            { range: [2,4], color: "orange"},
            { range: [4,6], color: "yellow"},
            { range: [6,8], color: "yellowgreen"},
            { range: [8,10], color: "green"}
          ],
          },
        },
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 420,
      height: 380

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};
