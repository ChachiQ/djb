#!/usr/bin/env node

var HID = require('node-hid');

// choose driverType
// default is 'libusb' for Mac OSX & Windows
// default is 'hidraw', for Linux
var type = null;

if (process.argv[2]) {
    type = process.argv[2];
}
// disabled until prebuild gets multi-target, see issue node-hid#242
// console.log('driverType:', (type) ? type : 'default');
// HID.setDriverType( type );


var devices = HID.devices();
console.log('devices:', HID.devices());
var deviceInfo = devices.find(function(d) {
    let isFlyDigi = d.vendorId === 6421 && d.productId === 64;
    return isFlyDigi //&& d.usagePage === 13 && d.usage === 2;
});

if (!deviceInfo) {
    console.log(`can't find flydigi devices.`)
    process.exit(0);
}

console.log(deviceInfo)


var hid = new HID.HID(deviceInfo.vendorId, deviceInfo.productId);
console.log(hid.getDeviceInfo())

hid.gotData = function(err, data) {
    console.log('got data');
    console.log(data.toString('hex'))
    console.log('\n')
    // map left & right d-pad to rumble, and right action buttons to LEDs
    // setRumbleLed(hid, data[15], data[17], data[3] >> 3);
    this.read(this.gotData.bind(this));
};

hid.read(hid.gotData.bind(hid));