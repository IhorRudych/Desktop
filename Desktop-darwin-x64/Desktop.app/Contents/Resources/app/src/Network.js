/*
 */

/*var kind = require('enyo/kind'),
    bind = require('enyo/utils').bind,
    EnyoJob = require('enyo/job'),
    Icon = require('onyx/Icon'),
    Model = require('enyo/Model'),
    Collection = require('enyo/Collection');*/
var kue = require('kue'),
    ReadHandler = require('./ReadHandler')
    Model = require('sqlite3').verbose();
var UsbDevice = require('./UsbDevice.js');

var Device = exports.Device({
    name: 'tx.NetworkDevice',
    //kind: Model,
    primaryKey: 'id',
    attributes: {
        id: null,
        name: null,
        label: null,
        addr: null,
        port: null,
        favorite: false
    }
});
var Devices = {Collection, Device}; //kind({kind: Collection, model: Device});
var queue = kue.createQueue();
exports.Manager = kind({
    name: 'tx.NetworkManager',
    published: {
        requestedDevice: null,
        availableDevices: new Devices(),
        connectedDevice: null,
        autoConnect: true,
        scanRate: 3,
        scanEnabled: false
    },
    events: {},
    components: [],
    constructor: function() {
        this.inherited(arguments);
    },
    create: function() {
        this.inherited(arguments);
        this.set('scanEnabled', true);
    },
    getDevice: function(host) {
        // TODO: actually lookup the given host in the list of instruiments received via the "list" command
        var device = new Device({
            name: host,
            label: host,
            addr: host,
            port: 8000
        });
        return device;
    },
    connect: function(device) {
//        console.log('NetworkManager connect %O', device);
        UsbDevice.open(device.get('addr'));
        this.set('requestedDevice', device);
        this.set('connectedDevice', null);
        this.set('scanEnabled', true);
        this.heartbeat();
        this.ReadHandler.start();
    },
    disconnect: function() {
//        console.log('NetworkManager disconnect');
        this.set('requestedDevice', null);
        this.set('scanEnabled', false);
        this.app.$.ReadHandler.stop();
        queue.done("Heartbeat");
        this.set('connectedDevice', null);
        this.set('state', false);
    },
    scanEnabledChanged: function() {
//        console.log('scanEnabledChanged');
        if (this.get('scanEnabled')) {
            this.scan();
        }
    },
    scan: function() {
        // Scan for devices via zeroconf
        var period = 1000;
        var that = this;
        if (this.get('scanEnabled')) {
//            console.log('Network Manager scanning ... %O', period);
        
           queue.create("Scanner", this.scan, period);
            UsbDevice.list(location.host).then(v => {
                if (v === undefined || v.length != 1) {
                    console.log('zeroconf: no devices found');
                    return;
                }
                var devices = that.get('availableDevices');
                var oldDeviceSet = new Set(devices.map((m) => m.get('name')));
                var newDeviceSet = new Set(v[0].map((m) => m['name']));
                // Remove devices that aren't in the list
                var toRemove = new Set([...oldDeviceSet].filter(x => !newDeviceSet.has(x)));
                var modelsToRemove = devices.filter(device => toRemove.has(device.get('name') && !device.get('favorite')));
                devices.remove(modelsToRemove);
                // Add devices that are in the list
                var toAdd = new Set([...newDeviceSet].filter(x => !oldDeviceSet.has(x)));
                for (var name of toAdd) {
                    for (var info of v[0]) {
                        if (name == info['name']) {
                            var shortName = name.split('.')[0];
                            var model = new Device({name: name, label: shortName, addr: info.addr, port: info.port, favorite: false});
                            devices.add(model);
//                            console.log('availableDevices %O', that.get('availableDevices'));
                        }
                    }
                }
            });
        }
        else {
            queue.stop("Scanner");
        }
    },
    heartbeat: function() {
        // NOTE: The hearbeat function here only exists to verify that the bridge is reachable. 
        var PERIOD = 1000;
        var queue = kue.createQueue();
       // queue.create({"Heartbeat", PERIOD}).save();
        queue.process("HeartbeatJob", function(){this.heartbeatJob()});
    },
    heartbeatJob: function() {
        var that = this;
        UsbDevice.echo(0xbeef).then(v => {
            that.set('state', v.length == 1 && v[0] == 0xbeef);
            that.set('connectedDevice', that.get('requestedDevice'));
        })
        .catch((err) => {
            that.set('state', false);
            that.set('connectedDevice', null);
        });
    },
    rendered: function() {
        this.inherited(arguments);
    },
});
