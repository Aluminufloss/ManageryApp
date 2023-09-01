const userService = require('../services/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password, password_again, username} = req.body;
            const userData = await userService.registration(email, password, password_again, username);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true});
            res.cookie('userEmail', email);
            return res.redirect('confirm');
        } catch (error) {
            next(error);
        }
    }

    async confirm(req, res, next) {
        try {

        } catch(error) {
            next(error);
        }
    }

    async logout(refreshToken, next) {
        try {
            const token = await tokenService.removeToken(refreshToken);
            return token;
        } catch(error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async downloadLoginPage(req, res, next) {
        try {
            res.render('C:\\Users\\Пользователь\\Desktop\\ManageryApp\\app\\views\\html\\login.html');
        } catch (error) {
            next(error);
        }
    }

    async downloadRegistrationPage(req, res, next) {
        try {
            res.render('C:\\Users\\Пользователь\\Desktop\\ManageryApp\\app\\views\\html\\registration.html');
        } catch (error) {
            next(error);
        }
    }

    async downloadTasksPage(req, res, next) {
        try {
            res.render('C:\\Users\\Пользователь\\Desktop\\ManageryApp\\app\\views\\html\\index.html');
        } catch (error) {
            next(error);
        }
    }

    async downloadConfirmPage(req, res, next) {
        try {
            res.render('C:\\Users\\Пользователь\\Desktop\\ManageryApp\\app\\views\\html\\confirmEmail.html');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
