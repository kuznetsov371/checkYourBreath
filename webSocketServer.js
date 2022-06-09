const { UserData } = require('./src/models');
const { Device } = require('./src/models');
const { Measurement } = require('./src/models');
const { adminService } = require('./src/services');
const { statisticService } = require('./src/services');

const activeSockets = new Map();
const onWSS = (wss) => {

    wss.on('connection', (ws) => {
        //when client connected

        console.log('A new client connected!');
        ws.send(JSON.stringify({ message: 'Welcome new client!' }));

        //when client sent a message

        ws.on('message', async (message) => {
            if (message) {
                try {
                    message = JSON.parse(message);
                    console.log('received: %s', message);
                    if (!message.value) {

                        ws.send(JSON.stringify({ message: 'Got your message its:' + JSON.stringify(message) }));

                        if (message.macAdress) {
                            ws.macAdress = message.macAdress;
                            activeSockets.set(ws.macAdress, ws);
                            console.log('arr on con', activeSockets);

                            const device = await Device.findById(ws.macAdress);
                            console.log(device);
                            const userData = await UserData.findById(device.user);
                            await Device.updateOne({_id:ws.macAdress},{statusOn:true});

                            await adminService.sendMessage(userData.cmToken, {
                                title: "Successfully connected",
                                body: "Device has been successfully connected to network. Now you can make test"
                            }, null);
                            await adminService.sendMessage(userData.cmToken, null, {
                                message: "device_status_update",
                                device_status: "true"
                            });
                        } else {
                            console.log('You should send macAdress by JSON');
                        }
                    } else {
                        if (ws.macAdress) {

                            const device = await Device.findById(ws.macAdress);
                            const userData = await UserData.findById(device.user);
                            let measurement = new Measurement({
                                value: message.value,
                                uid: device.user
                            });
                            measurement = await measurement.save();

                            //statisticService.updateHighest(message.value,userData);
                            statisticService.updateStatistic(userData,measurement);


                            await adminService.sendMessage(userData.cmToken, {
                                title: "Measurment DONE",
                                body: `Device has done a measurment.Value: ${message.value}`
                            }, null);
                            await adminService.sendMessage(userData.cmToken, null, {
                                message: "measurement_value_received",
                                measurement: JSON.stringify({
                                    _id: measurement._id,
                                    value: measurement.value,
                                    uid: measurement.uid,
                                    date: measurement.date.toISOString().split('T')[0]
                                })
                            });
                        } else {
                            console.log('No active socket');
                        }
                    }
                } catch (e) {
                    console.log(e);
                }


            }
        });

        //when client disconnect
        ws.on('close', async () => {
            console.log('Discon');
            macAdress = ws.macAdress;
            if (macAdress) {
                activeSockets.delete(macAdress);
                console.log('arr on close:', activeSockets);


                const device = await Device.findById(ws.macAdress);
                const userData = await UserData.findById(device.user);
                await Device.updateOne({_id:macAdress},{statusOn:false});

                await adminService.sendMessage(userData.cmToken, {
                    title: "Successfully disconnected",
                    body: "Device has been successfully disconnected from network."
                }, null);
                await adminService.sendMessage(userData.cmToken, null, {
                    message: "device_status_update",
                    device_status: "false"
                });
            }
            else {
                console.log('No macAdress!');
            }

        });
    });
}

module.exports = {
    onWSS,
    activeSockets,
};