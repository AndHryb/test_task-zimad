import InternalServerError from '../errors/InternalServerError.js';

export default class UsersRepository {
  constructor(pool) {
    this.pool = pool;
  }

  static mapUser(user) {
    const {
      id: userId,
      name,
      email,
      role,
      password_hash: passwordHash,
      created_at: createdAt,
      updated_at: updatedAt,
    } = user;

    return {
      userId,
      name,
      email,
      role,
      passwordHash,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt && updatedAt.toISOString(),
    };
  }

  addUser = async (data) => {
    const {
      name,
      email,
      passwordHash,
    } = data;

    const query = `
    INSERT INTO files.users(id, name, password_hash) 
    VALUES (?, ?, ?);
    SELECT * FROM files.users WHERE id = ?;
    `;

    const params = [email, name, passwordHash, email];

    try {
      const [result] = await this.pool.query(query, params);
      const [, rows] = result;
      const [newUser] = rows;

      return UsersRepository.mapUser(newUser);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  getUserById = async (email) => {
    const query = `
    SELECT u.id, u.name, u.password_hash, u.created_at, u.updated_at 
    FROM files.users u 
    WHERE u.id=?
    LIMIT 1;
    `;

    const params = [email];

    try {
      const [rows] = await this.pool.query(query, params);
      const [user] = rows;

      if (!user) {
        return null;
      }

      return UsersRepository.mapUser(user);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  /**
   * Get list of all users
   *
   * @async
   * @returns {Promise<array>} Returns an array of users
   */
  getAllUsers = async () => {
    const query = 'SELECT * FROM auth.get_all_users()';

    try {
      const {
        rows: users,
      } = await this.pool.query(query);

      return users.map((user) => UsersRepository.mapUser(user));
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  /**
   * Delete user by id
   *
   * @async
   * @param {number} id - User id
   * @returns {Promise<number>} Returns the number of deleted rows
   */
  deleteUserById = async (id) => {
    const query = 'SELECT auth.delete_user($1)';

    const params = [id];

    try {
      const {
        rows: [result],
      } = await this.pool.query(query, params);

      return result.delete_user;
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };
}
