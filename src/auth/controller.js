import { StatusCodes } from 'http-status-codes';

export default class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res) => {
    const { name, email, password } = req.body;

    const newUser = await this.authService.register({
      name,
      email,
      password,
    });

    res.status(StatusCodes.OK).json(newUser);
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    const user = await this.authService.login({
      email,
      password,
    });

    res.status(StatusCodes.OK).json(user);
  };

  logout = async (req, res) => {
    const { refreshToken } = req.body;

    await this.authService.logout({ refreshToken });

    res.status(StatusCodes.OK).send();
  };

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    const tokenList = await this.authService.refreshToken(refreshToken);

    res.status(StatusCodes.OK).json(tokenList);
  };
}
