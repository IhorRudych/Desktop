const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer
//var Plotly = require('plotly')("IhorRudych", "DdQ6kELrUrOx434A7vc6");
const Plotly = require('plotly.js');
//import * as Plotly from 'plotly.js';

trace1 = {x:[1,2,3,4,5], y:[1,5,1,7,1]};
trace2 = {x:[1,3,6,9,10], y:[1,12,1,18,1]};

myDiv = document.getElementById('MyDiv');

console.log(myDiv);

Plotly.plot(myDiv,[trace1, trace2]);