import { StatusCodes } from 'http-status-codes';
import NoUserFoundError from './errors/NoUserFoundError.js';

export default class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  info = async (req, res) => {
    const { user: { id } } = req;

    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NoUserFoundError();
    }

    res.status(StatusCodes.OK).json(id);
  };
}
