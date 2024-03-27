// Get JSON from link
var jsonData;
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){jsonData = init(data);});

function init(data){
    console.log(data.metadata);

    // Add names to dropdown list
    for(let i = 0; i < data.names.length; i++){
        d3.select("#selDataset").append("option").text(data.names[i]);
    }

    return data;
}

function optionChanged(value){
    // Get metadata of selected id
    // find() function taken from StackOverflow: https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
    let selectedData = jsonData.metadata.find(item => {
        return parseInt(item.id) === parseInt(value);
    });

    // Set info in Demographic Info table
    d3.select("#info-id").text(`id: ${selectedData.id}`);
    d3.select("#info-ethnicity").text(`ethnicity: ${selectedData.ethnicity}`);
    d3.select("#info-gender").text(`gender: ${selectedData.gender}`);
    d3.select("#info-age").text(`age: ${selectedData.age}`);
    d3.select("#info-location").text(`location: ${selectedData.location}`);
    d3.select("#info-bbtype").text(`bbtype: ${selectedData.bbtype}`);
    d3.select("#info-wfreq").text(`wfreq: ${selectedData.wfreq}`);
}