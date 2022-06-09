const { Router } = require('express');
const { Device } = require('../../models');
const { adminService } = require('../../services');

const deviceRouter = Router();

deviceRouter.get('/', async (req, res) => {
    res.json(await Device.find());
});

deviceRouter.get('/:id', async (req, res) => {
    res.json(await Device.findById(req.params.id));
});


deviceRouter.post('/', async (req, res) => {
    await adminService.admin.auth().verifyIdToken(req.body.idToken)
        .then(async (decodenToken) => {
            const device = new Device({
                _id: req.body.macAdress,
                user: decodenToken.uid
            });
            res.json(await device.save());
        })
        .catch((error) => {
            res.status(401).send(error);
        });
});

module.exports = deviceRouter;