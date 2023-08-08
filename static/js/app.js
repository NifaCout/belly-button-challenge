let selectedID = "940";

let jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(jsonURL).then(data => {
  // Find the data for the selected ID
  let selectedData = data.samples.find(entry => entry.id === selectedID);
  
  // Create an array of indices and sort them based on corresponding sample values
  let indicesWithValue = selectedData.otu_ids.map((id, index) => ({ id, value: selectedData.sample_values[index] }));
  indicesWithValue.sort((a, b) => b.value - a.value);
  
  // Select the top 10 OTUs
  let topIndices = indicesWithValue.slice(0, 10).map(item => item.id);
  let topValues = indicesWithValue.slice(0, 10).map(item => item.value);
  let topLabels = indicesWithValue.slice(0, 10).map(item => selectedData.otu_labels[selectedData.otu_ids.indexOf(item.id)]);

  // Create the bar chart trace
  let bartrace = {
    x: topValues,
    y: topIndices.map(id => `OTU ${id}`),
    text: topLabels,
    type: "bar",
    orientation: "h"
  };

  // Create the layout
  let layout = {
    title: `${selectedID}'s Top 10 OTUs`,
  };

  // Plot the bar chart
  let barchartData = [bartrace];
  Plotly.newPlot("bar", barchartData, layout);
});

// Use D3 to fetch the JSON data from the URL
  d3.json(jsonURL).then(data => {
    // Find the data for the selected ID
    let selectedData = data.samples.find(entry => entry.id === selectedID);
  
    // Create the bubble chart trace
    let bubbletrace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: "Viridis"
      },
      text: selectedData.otu_labels
    };
  
    // Create the layout for the bubble chart
    let layout = {
      title: `${selectedID}'s Bubble Chart`,
      
    };
  
    // Create the chart data array and plot the bubble chart
    let bubblechartData = [bubbletrace];
    Plotly.newPlot("bubble", bubblechartData, layout);
  });