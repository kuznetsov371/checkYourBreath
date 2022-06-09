const { Router } = require('express');

const { UserData } = require('../../models');
const { adminService } = require('../../services');

const userDataRouter = Router();

userDataRouter.get('/', async (req, res) => {
    res.json(await UserData.find());
});


userDataRouter.get('/:idToken', async (req, res) => {

    await adminService.admin.auth().verifyIdToken(req.params.idToken)
        .then(async (decodenToken) => {
            res.json(await UserData.findById(decodenToken.uid));
        }).catch((error) => {
            res.send(error)
        });
});


userDataRouter.post('/', async (req, res) => {
        await adminService.admin.auth().verifyIdToken(req.body.idToken)
        .then(async (decodenToken) => {
            const userData = new UserData({
                _id: decodenToken.uid,
                cmToken: req.body.cmToken
            });
            res.json(await userData.save());
        })
        .catch((error) => {
            res.status(400).send(error);
        });   
});


userDataRouter.put('/refreshToken/:idToken', async (req, res) => {

    await adminService.admin.auth().verifyIdToken(req.params.idToken)
        .then(async (decodenToken) => {
            res.json(await UserData.findByIdAndUpdate(decodenToken.uid, { cmToken: req.body.cmToken }, { new: true }));
        }).catch((error) => {
            res.send(error);
        });
});

userDataRouter.delete('/:id', async (req, res) => {
    await UserData.findByIdAndDelete(req.params.id);
    res.status(200).send();
});

module.exports = userDataRouter;