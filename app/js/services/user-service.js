const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const mailService = require('../services/mail-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(email, password, password_again, username) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует`);
    }

    if (password !== password_again) {
      throw ApiError.BadRequest(`Пароли не сходятся`);
    }

    const activationCode = randomCodeGenerator();
    const hashPassword = await bcrypt.hash(password, 4);
    const user = await UserModel.create({username, email, password:hashPassword, activationCode});

    // await mailService.sendActivationCode(email, activationCode);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});

    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email ${email} не был найден`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неккоректный пароль`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(e);
    }
  }

  async activate(activationCode) {
    const user = await UserModel.findOne({activationCode});
    if (!user) throw ApiError.BadRequest('Неккоректная ссылка активации');
    user.isActiveted = true;
    await user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDatabase = await tokenService(refreshToken);
    if (!userData || !tokenFromDatabase) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }
}

function randomCodeGenerator() {
  let result = "";
  
  for (let i = 0; i < 4; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}

module.exports = new UserService();
