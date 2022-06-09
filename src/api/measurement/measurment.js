const { Router } = require('express');
const { Device } = require('../../models');
const { Measurement } = require('../../models');
const { adminService } = require('../../services');
const webSocketServer = require('../../../webSocketServer');

const measurementRouter = Router();

//TO TEST
measurementRouter.get('/:idToken', async (req, res) => {
    await adminService.admin.auth().verifyIdToken(req.params.idToken)
        .then(async (decodenToken) => {
            const unparsedMeasurements = await Measurement.find({ uid: decodenToken.uid });
            parsedMeasurments = [];

            for (var i = 0; i < unparsedMeasurements.length; i++) {
                parsedMeasurments[i] = {
                    _id: unparsedMeasurements[i]._id.toString(),
                    value: unparsedMeasurements[i].value,
                    uid: unparsedMeasurements[i].uid,
                    date: unparsedMeasurements[i].date.toISOString().split('T')[0]
                };
            };

            res.send(parsedMeasurments);
        })
        .catch((error) => {
            res.status(401).send(error);
        });
});

measurementRouter.post('/', async (req, res) => {
    let ws = null;

    await adminService.admin.auth().verifyIdToken(req.body.idToken)
        .then(async (decodenToken) => {
            const macAdress = await Device.findOne({ user: decodenToken.uid }, { _id: 1 });
            if (macAdress) {
                ws = webSocketServer.activeSockets.get(macAdress._id);
            }
            if (!ws) {
                res.sendStatus(404);
            } else {
                ws.send(JSON.stringify({ command: "start" }));
                res.sendStatus(200);
            }
        })
        .catch((error) => {
            res.status(401).send(error);
        });
});

module.exports = measurementRouter;