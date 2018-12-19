const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer
//var Plotly = require('plotly')("IhorRudych", "DdQ6kELrUrOx434A7vc6");
var fs = require('fs')
var parse = require('csv-parse')
var Plotly = require('plotly.js')

var data_config = [
    // Channel 0
    {
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            opacity: 0
        },
        line: { width: 2 },
        name: 'Channel 1',
    },
    // Channel 1
    {
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            opacity: 0
        },
        line: { width: 2 },
        name: 'Channel 2',
    },
    // Channel 2
    {
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            opacity: 0
        },
        line: { width: 2 },
        name: 'Channel 3',
    },
    // Channel 3
    {
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            opacity: 0
        },
        line: { width: 2 },
        name: 'Channel 4',
    },
    // Method
    {
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            opacity: 0
        },
        line: {
            color: 'rgba(136,189,134,1.0)',
            width: 1
        },
        name: 'Method',
        yaxis: 'y2',
        fill: 'tozeroy',
        fillcolor: 'rgba(74,74,74,0.25)',
    },
];
var layout_config = {
    autosize: true,
    showlegend: false,
    paper_bgcolor: 'rgb(20,20,20)',
    plot_bgcolor: 'rgb(20,20,20)',
    //            margin: {l: 32, r: 32, b: 64, t: 32, pad: 0},
    margin: { l: 8, r: 0, b: 0, t: 0, pad: 0 },
    xaxis: {
//                title: 'minutes',
//                titlefont: {
//                    size: 18,
//                    color: '#ffffff'
//                },
        autorange: true,
        rangemode: 'tozero',
        //    autotick: true,
        //    tickmode: 'none',
        //    ticks: '',
        tickcolor: 'rgb(255, 255, 255)',
        tickfont: {
            color: 'rgb(255, 255, 255)',
        },
        showgrid: false,
        showline: false,
        showticklabels: true,
        zeroline: true,
        zerolinecolor: 'rgb(255, 255, 255)',
        zerolinewidth: 1,
    },
    yaxis: {
        autorange: true,
        rangemode: 'nonnegative',
        //            autotick: true,
        //            tickmode: 'none',
        //            ticks: '',
        tickcolor: 'rgb(255, 255, 255)',
        tickfont: {
            color: 'rgb(255, 255, 255)',
        },
        showgrid: false,
        showline: false,
        showticklabels: true,
        zeroline: true,
        zerolinecolor: 'rgb(255, 255, 255)',
        zerolinewidth: 1,
    },
    yaxis2: {
        overlaying: 'y',
        side: 'right',
        //                range: [0, 100],
        tickcolor: 'rgb(255, 255, 255)',
        zerolinecolor: 'rgb(255, 255, 255)',
        tickfont: {
            color: 'rgb(255, 255, 255)',
        },
    },
};
var global_config = {
    displayModeBar: 'hover',
    scrollZoom: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
        'toImage',
        'sendDataToCloud',
        'pan2d',
        'lasso2d',
        'select2d',
        'zoom2d',
        'autoScale2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'toggleSpikelines']
};


var sample = './src/data2.csv';
fs.readFile(sample, 'utf-8', (err, data) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }
    parse(data, {columns: false, trim: false}, function(err, rows) {
        var arrx = new Array;
        var arry = new Array;
        var arry2 = new Array; 
        
        for (i=0;i<rows.length;i++){
           
           var x = parseFloat(rows[i][0]);
           var y = parseFloat(rows[i][1]);
           var y2 = parseFloat(rows[i][2]);
           

            arrx.push(x);
            arry.push(y);
            arry2.push(y2);
        }
       trace1 = {x:arrx, y:arry};
       trace2 = {x:arrx, y:arry2};

       myDiv = document.getElementById('MyDiv');
       Plotly.plot(myDiv,[trace1, trace2], layout_config, global_config);
        //return;
      })
      return; 
});

