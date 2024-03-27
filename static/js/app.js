// Get JSON from link
var jsonData;
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){jsonData = init(data);});

function init(data){
    //console.log(data);

    // Add names to dropdown list
    for(let i = 0; i < data.names.length; i++){
        d3.select("#selDataset").append("option").text(data.names[i]);
    }

    return data;
}

function optionChanged(value){
    // Get metadata and samples of selected id
    // find() function taken from StackOverflow: https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
    let metadata = jsonData.metadata.find(item => {
        return parseInt(item.id) === parseInt(value);
    });
    let samples = jsonData.samples.find(item => {
        return parseInt(item.id) === parseInt(value);
    });

    // Set info in Demographic Info table
    d3.select("#info-id").text(`id: ${metadata.id}`);
    d3.select("#info-ethnicity").text(`ethnicity: ${metadata.ethnicity}`);
    d3.select("#info-gender").text(`gender: ${metadata.gender}`);
    d3.select("#info-age").text(`age: ${metadata.age}`);
    d3.select("#info-location").text(`location: ${metadata.location}`);
    d3.select("#info-bbtype").text(`bbtype: ${metadata.bbtype}`);
    d3.select("#info-wfreq").text(`wfreq: ${metadata.wfreq}`);

    createCharts(samples);
}

function createCharts(samples){
    // Put samples into easier-to-work-with array
    let sortedSamples = [];
    for(let i = 0; i < samples.otu_ids.length; i++){
        sortedSamples.push({
            "otu_id": samples.otu_ids[i],
            "sample_value": samples.sample_values[i],
            "otu_label": samples.otu_labels[i]
        });
    }

    // Sort in descending order by sample_value
    sortedSamples = sortedSamples.sort(function(a, b) {
        return b.sample_value - a.sample_value;
    });

    // Create trace for horizontal bar chart
    let dataBar = [{
        x: sortedSamples.map(sample => sample.sample_value).slice(0, 10).reverse(),
        y: sortedSamples.map(sample => `OTU ${sample.otu_id}`).slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    
    // Plot the charts
    Plotly.newPlot("bar", dataBar);
}