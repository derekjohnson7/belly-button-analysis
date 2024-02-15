//assign url variable to the url
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


//create a function named metaData
function metaData(sample){
    d3.json(url).then(function(data){

        //store the metadata to a variable metadata
        let metadata = data.metadata;
        
        //create a variable to store the filtered data
        let Array = metadata.filter(sampleObj => sampleObj.id == sample);

        //find the first oject in the array
        let result = Array[0];

        //assign a variable to the html element that stores the object from result
        let panel = d3.select("#sample-metadata").html("");

        //for loop that appends the key value pairs from the result
        for (key in result) {
            panel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`)
        }
        
    })
};

//create bar and bubble charts
function Charts(sample){
    d3.json(url).then((data)=> {

        //grab the samples from the data that was retrieved
        let samples = data.samples;

         //create a variable to store the filtered data
        let Array = samples.filter(sampleObj => sampleObj.id == sample);
        let result = Array[0];
        
        //create variables to store our x, y, and labels
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // build a Bubble Chart

        let bubble_layout = {
            title: "  ",
            margin: {t: 30},
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            

        };

        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"

            }
        }];

        //plot the bubble chart using Plotly
        Plotly.newPlot("bubble", bubbleData, bubble_layout);

        //create a variable to store only the top values in descending order
        let yticks = otu_ids.slice(0, 10).map( otuID => `OTU ${otuID}`).reverse();
        
        //create a bar chart
        let barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        let bar_layout = {
            title: "   ",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, bar_layout);

    });
}

// //fetch json data and console log it
// d3.json(url).then(function(data){
//     console.log(data);
// });

function init() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Create the dropdown list by iterating over the values
    d3.json(url).then((data) => {
        let sampleName = data.names
        // let name_ = [];
        // data.metadata.forEach(function(sample){
        //     name_.push(sample.id)
        //     //             console.log("id: ",sample.id)
        // });

        for (let i = 0; i <sampleName.length; i++){

            dropdownMenu.append('option').text(sampleName[i]).property('value', sampleName[i]);
        };


        //
        // Create the first sample for our init page
        let firstSample = sampleName[0];
        Charts(firstSample);
        metaData(firstSample);

        // Console log the sample
        
        // // Build charts
        // metaData(firstSample);
        // barChart(firstSample);
        // bubbleChart(firstSample);
        console.log (firstSample.id, firstSample.ethnicity)
    });
    
}
function optionChanged(newSample){
    Charts(newSample);
    metaData(newSample);
}

init();
