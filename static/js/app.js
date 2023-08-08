let jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data and create bar chart
function fetchDataAndUpdate(selectedID) {
  d3.json(jsonURL).then(data => {
    let selectedData = data.samples.find(entry => entry.id === selectedID);

    let indicesWithValue = selectedData.otu_ids.map((id, index) => ({ id, value: selectedData.sample_values[index] }));
    indicesWithValue.sort((a, b) => b.value - a.value);

    let topIndices = indicesWithValue.slice(0, 10).map(item => `OTU ${item.id}`);
    let topValues = indicesWithValue.slice(0, 10).map(item => item.value);
    let topLabels = indicesWithValue.slice(0, 10).map(item => selectedData.otu_labels[selectedData.otu_ids.indexOf(item.id)]);

    let bartrace = {
      x: topValues.reverse(),
      y: topIndices.reverse(),
      text: topLabels.reverse(),
      type: "bar",
      orientation: "h"
    };

    let layout = {
      title: `${selectedID}'s Top 10 OTUs`,
    };

    let barchartData = [bartrace];
    Plotly.newPlot("bar", barchartData, layout);

    // Update bubble chart
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

    let bubbleLayout = {
      title: `${selectedID}'s Bubble Chart`,
    };

    let bubbleChartData = [bubbletrace];
    Plotly.newPlot("bubble", bubbleChartData, bubbleLayout);

    // Update metadata panel
    let metadataPanel = d3.select("#sample-metadata");
    let selectedMetadata = data.metadata.find(entry => entry.id === +selectedID);

    metadataPanel.html(""); // Clear the existing content

    // Append each key-value pair from the metadata to the panel
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Populate the dropdown with test subject IDs and add event listener
let dropdown = d3.select("#selDataset");
d3.json(jsonURL).then(data => {
  data.names.forEach(id => {
    dropdown.append("option").attr("value", id).text(id);
  });

  dropdown.on("change", function() {
    let selectedID = this.value;
    fetchDataAndUpdate(selectedID);
  });

  // Initialize the charts and metadata
  let initialSelectedID = data.names[0];
  fetchDataAndUpdate(initialSelectedID);
});