const Router = require('express');
const router = new Router();
const controller = require("../controllers/user-controller");
const {body} = require('express-validator');

router.get('/login', controller.downloadLoginPage);
router.post('/login', controller.login);

router.get('/registration', controller.downloadRegistrationPage);
router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    controller.registration
);

router.get('/confirm', controller.downloadConfirmPage);
router.post('/confirm', controller.confirm);

router.get('/tasks', controller.downloadTasksPage);

module.exports = router;