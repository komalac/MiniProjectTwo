function buildMetadata(sample_metadata) {
  var url = "/metadata/" + sample_metadata;
  // @TODO: Complete the following function that builds the metadata panel
  var ddiv = d3.select("#sample-metadata");
  ddiv.html("");
  
  d3.json(url).then(function(response) {
  var pdata = document.createElement("h6");
  
  
  Object.entries(response).forEach(([key, value]) => {
          
      var cell = ddiv.append("h6");
      var dvalue = key +": " + value
      cell.text(dvalue);
    
    })
    
    buildGauge(response['WFREQ'])
  })

  
  
 
};
 
function buildGauge(gdata){

    var level = parseFloat(gdata) * 20;

        var data = [{ type: 'scatter',
        x: [0], y:[0],
        marker: {size: 24, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
        { values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
        rotation: 90,
        
        text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        textinfo: 'text',
        textposition:'inside',
        hole: .5,
        type: 'pie',
        showlegend: false,
        marker: {
              colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                  'rgba(130, 182, 42, .5)', 'rgba(142, 200, 95, .5)',
                                  'rgba(155, 216, 135, .5)', 'rgba(165, 226, 202, .5)',
                                  'rgba(175, 235, 215, .5)','rgba(190, 245, 225, .5)','rgba(220, 250, 235,.5)','rgba(255, 255, 255, 0)']},
              labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
              hoverinfo: 'label'       
        }];

        // Trig to calc meter point
        var degrees = 180-level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var layout = {
        shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
        }],
        // title: 'Gauge',
        Speed : '0-100',
        height: 500,
        width: 600,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };

            Plotly.newPlot('gauge', data, layout)

  }
  

function buildCharts(sample) {

  
  // @TODO: Build a Pie Chart
  var url = "/samples/" + sample;
  d3.json(url).then(function(response) {
    
      var data = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      type: 'pie'
    }];

    var layout = {
      // title: "Samples "+sample,
      xaxis: {
        title: "Samples"
      },
      yaxis: {
        title: "otu id"
      }
    };

    Plotly.newPlot("pie", data, layout);
  });


  // @TODO: Build a Bubble Chart using the sample data

  d3.json(url).then(function(response) {

           
    var data = [{
      x: response.otu_ids,
      y: response.sample_values,
      // text: response.otu_labels,
      mode:'markers',
      marker:{
        size:response.sample_values,
        color:response.otu_ids
      }
      
    }];

    var layout = {
      // title: "Samples "+sample,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Samples"
      }
    };

    Plotly.newPlot("bubble", data, layout);
  });
  
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  

}
    


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

// Initialize the dashboard
init();
