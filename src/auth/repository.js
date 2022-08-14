import InternalServerError from '../errors/InternalServerError.js';

export default class AuthRepository {
  constructor(pool) {
    this.pool = pool;
  }

  static mapSession = (session) => {
    const {
      refresh_token: refreshToken,
      user_id: userId,
      expires_at: expiresAt,
      created_at: createdAt,
      updated_at: updatedAt,
    } = session;

    return {
      refreshToken,
      userId,
      expiresAt: expiresAt && expiresAt.toISOString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt && updatedAt.toISOString(),
    };
  };

  createRefreshToken = async (data) => {
    const { token, userId, expiresAt } = data;

    const query = `
    INSERT INTO files.refresh_token(refresh_token, user_id, expires_at) 
    VALUES (?, ?, ?);
    SELECT * FROM files.refresh_token WHERE refresh_token = ?;
    `;

    const params = [token, userId, expiresAt, token];

    try {
      const [result] = await this.pool.query(query, params);
      const [, rows] = result;
      const [session] = rows;

      return AuthRepository.mapSession(session);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  deleteRefreshToken = async (data) => {
    const { refreshToken } = data;

    const query = `
    DELETE FROM  files.refresh_token as rt
    WHERE rt.refresh_token = ?;
    `;

    const params = [refreshToken];

    try {
      await this.pool.query(query, params);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  getRefreshToken = async (token) => {
    const query = `
    SELECT rt.refresh_token, rt.user_id, rt.expires_at, rt.created_at, rt.updated_at 
    FROM files.refresh_token rt 
    WHERE rt.refresh_token=? 
    LIMIT 1;
    `;

    const params = [token];

    try {
      const [rows] = await this.pool.query(query, params);
      const [session] = rows;

      if (!session) {
        return null;
      }

      return AuthRepository.mapSession(session);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  updateRefreshToken = async (data) => {
    const { currentToken, newToken, expiresAt } = data;

    const query = `
    UPDATE files.refresh_token rt
    SET refresh_token=?, expires_at=? 
    WHERE rt.refresh_token=?;
    SELECT * FROM files.refresh_token rt WHERE rt.refresh_token = ?;
    `;

    const params = [newToken, expiresAt, currentToken, newToken];

    try {
      const [result] = await this.pool.query(query, params);
      const [, rows] = result;
      const [session] = rows;

      if (!session) {
        throw new Error('Token is missing');
      }

      return AuthRepository.mapSession(session);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  deleteExpiredTokens = async (date) => {
    const query = `
    DELETE FROM files.refresh_token WHERE refresh_token.expires_at < ?;
    `;

    const params = [date];

    try {
      const {
        rows: [result],
      } = await this.pool.query(query, params);

      return result.delete_expired_tokens;
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };
}
