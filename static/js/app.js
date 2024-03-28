// Get JSON from link
var jsonData;
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){jsonData = init(data);});

function init(data){
    console.log(data);

    // Add names to dropdown list
    for(let i = 0; i < data.names.length; i++){
        d3.select("#selDataset").append("option").text(data.names[i]);
    }

    // Initialize starting dataset
    optionChanged(data, d3.select("#selDataset").property("value"));

    return data;
}

function optionChanged(data, value){
    // Get metadata and samples of selected id
    // find() function taken from StackOverflow: https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
    let metadata = data.metadata.find(item => {
        return parseInt(item.id) === parseInt(value);
    });
    let samples = data.samples.find(item => {
        return parseInt(item.id) === parseInt(value);
    });

    setDemographicInfo(metadata);
    createCharts(samples);
}

function setDemographicInfo(metadata){
    // Set info in Demographic Info table
    d3.select("#info-id").text(`id: ${metadata.id}`);
    d3.select("#info-ethnicity").text(`ethnicity: ${metadata.ethnicity}`);
    d3.select("#info-gender").text(`gender: ${metadata.gender}`);
    d3.select("#info-age").text(`age: ${metadata.age}`);
    d3.select("#info-location").text(`location: ${metadata.location}`);
    d3.select("#info-bbtype").text(`bbtype: ${metadata.bbtype}`);
    d3.select("#info-wfreq").text(`wfreq: ${metadata.wfreq}`);
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

    // Create traces for all charts
    let traceArr = [[{
        x: sortedSamples.map(sample => sample.sample_value).slice(0, 10).reverse(),
        y: sortedSamples.map(sample => `OTU ${sample.otu_id}`).slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        text: sortedSamples.map(sample => sample.otu_label).slice(0, 10).reverse()
    }],[{
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: 'markers',
        marker: {
          size: samples.sample_values,
          color: samples.otu_ids
        },
        text: samples.otu_labels
    }]];
    
    // Plot the charts
    Plotly.newPlot("bar", traceArr[0]);
    Plotly.newPlot("bubble", traceArr[1]);
}