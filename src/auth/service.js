import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import APIError from '../errors/APIError.js';
import IncorrectCredentialsError from './errors/IncorrectCredentialsError.js';
import { hashPassword, comparePassword, getRefreshTokenExpiration } from '../helpers/auth/index.js';

export default class AuthService {
  constructor(config, repository, usersService) {
    this.config = config;
    this.usersService = usersService;
    this.repository = repository;
  }

  generateAccessToken = ({ userId }) => {
    try {
      return jwt.sign(
        { id: userId },
        this.config.get('auth.jwtSecret'),
        { expiresIn: this.config.get('auth.jwtExpireTime') },
      );
    } catch (e) {
      throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, e.message);
    }
  };

  static sanitizeUser = ({
    passwordHash,
    createdAt,
    updatedAt,
    ...user
  }) => user;

  createRefreshToken = async (userId) => {
    const token = await this.repository.createRefreshToken({
      token: uuidv4(),
      userId,
      expiresAt: getRefreshTokenExpiration(this.config.get('auth.refreshTokenExpireTime')),
    });

    return token;
  };

  register = async ({
    name,
    email,
    password,
  }) => {
    const user = await this.usersService.getUserById(email);

    if (user) {
      throw new APIError(StatusCodes.CONFLICT, 'Email already exists');
    }

    const salt = this.config.get('auth.salt');

    const passwordHash = await hashPassword(password, salt);

    const newUser = await this.usersService.addUser({
      name,
      email,
      passwordHash,
    });

    const { refreshToken } = await this.createRefreshToken(newUser.userId);

    const token = this.generateAccessToken(newUser);

    return {
      user: { ...AuthService.sanitizeUser(newUser) },
      token,
      refreshToken,
    };
  };

  login = async ({ email, password }) => {
    const user = await this.usersService.getUserById(email);

    if (!user) {
      throw new IncorrectCredentialsError();
    }

    const isPasswordsMatch = await comparePassword({
      enteredPassword: password,
      hashedPassword: user.passwordHash,
    });

    if (!isPasswordsMatch) {
      throw new IncorrectCredentialsError();
    }

    const { refreshToken } = await this.createRefreshToken(user.userId);

    const token = this.generateAccessToken(user);

    return {
      user: { ...AuthService.sanitizeUser(user) },
      token,
      refreshToken,
    };
  };

  logout = async (data) => this.repository.deleteRefreshToken(data);

  refreshToken = async (currentToken) => {
    const currentSession = await this.repository.getRefreshToken(currentToken);

    if (!currentSession) {
      throw new APIError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
    }

    const { userId, expiresAt } = currentSession;

    if (expiresAt && Date.now() > new Date(expiresAt).getTime()) {
      throw new APIError(StatusCodes.UNAUTHORIZED, 'Refresh token is expired');
    }

    const { refreshToken } = await this.repository.updateRefreshToken({
      currentToken,
      newToken: uuidv4(),
      expiresAt: getRefreshTokenExpiration(this.config.get('auth.refreshTokenExpireTime')),
    });

    const token = this.generateAccessToken({
      userId,
    });

    return {
      token,
      refreshToken,
    };
  };
}
