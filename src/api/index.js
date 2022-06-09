const { Router } = require('express');

const apiRouter = Router();

apiRouter.use('/usersData', require('./usersData/usersData'));
apiRouter.use('/device', require('./device/device'));
apiRouter.use('/measurement', require('./measurement/measurment'));

module.exports = apiRouter;