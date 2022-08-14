import NoUserFoundError from './errors/NoUserFoundError.js';

export default class UsersService {
  constructor(repository, messageBroker) {
    this.repository = repository;
    this.messageBroker = messageBroker;
  }

  static sanitizeUser = ({ passwordHash, ...user }) => user;

  addUser = async ({
    name,
    email,
    passwordHash,
  }) => {
    const newUser = await this.repository.addUser({
      name,
      email,
      passwordHash,
    });

    return newUser;
  };

  getUserById = async (id) => {
    const user = await this.repository.getUserById(id);

    return user;
  };

  getAllUsers = async () => {
    const users = await this.repository.getAllUsers();

    return users.map(UsersService.sanitizeUser);
  };

  deleteUserById = async (id) => {
    const rowsCount = await this.repository.deleteUserById(id);

    if (rowsCount === 0) {
      throw new NoUserFoundError();
    }

    await this.messageBroker.sendMessage('deleteUser', JSON.stringify({ id }));
  };
}
