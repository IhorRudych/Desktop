const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer

var plotly = require('plotly');

var trace1 = {x:[1,2,3,4,5], y:[1,5,3,7,9]};
var trace2 = {x:[1,3,6,9,10], y:[1,2,16,18,20]};

let pl = document.getElementById('plot');

plotly.plot(pl,[trace1, trace2]);