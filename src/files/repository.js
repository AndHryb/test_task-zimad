import InternalServerError from '../errors/InternalServerError.js';

export default class FilesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  static mapFilesData = (data) => {
    const {
      id,
      name,
      mimetype,
      extension,
      size,
      created_at: createdAt,
      updated_at: updatedAt,
    } = data;

    return {
      id,
      name,
      mimetype,
      extension,
      size,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt && updatedAt.toISOString(),
    };
  };

  createFileData = async (data) => {
    const {
      storageKey, fileName, mimetype, fileExtension, size,
    } = data;

    const query = `
      INSERT INTO files.files_data(id, name, mimetype, extension, size) 
      VALUES (?, ?, ?, ?, ?);
      SELECT * FROM files.files_data 
      WHERE id = ?;
      `;

    const params = [storageKey, fileName, mimetype, fileExtension, size, storageKey];

    try {
      const [result] = await this.pool.query(query, params);
      const [, rows] = result;
      const [fileData] = rows;

      return FilesRepository.mapFilesData(fileData);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  getFileData = async (id) => {
    const query = `
    SELECT * FROM files.files_data
    WHERE id = ?;
    `;

    const params = [id];

    try {
      const [rows] = await this.pool.query(query, params);
      const [fileData] = rows;
      if (!fileData) {
        return null;
      }

      return FilesRepository.mapFilesData(fileData);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  deleteFileData = async (id) => {
    const query = `
    SELECT * FROM files.files_data
    WHERE id = ?;
    DELETE FROM files.files_data
    WHERE id = ?;
    `;
    const params = [id, id];
    try {
      const [result] = await this.pool.query(query, params);
      const [rows] = result;
      const [fileData] = rows;
      if (!fileData) {
        return null;
      }

      return FilesRepository.mapFilesData(fileData);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  getFileListData = async ({ limit, offset }) => {
    const query = `
    SELECT * FROM files.files_data
    LIMIT ?
    OFFSET ?;
    `;

    const params = [limit, offset];

    try {
      const [rows] = await this.pool.query(query, params);

      return rows.map(FilesRepository.mapFilesData);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };

  updateFileData = async (data) => {
    const { id, name } = data;

    const query = `
      UPDATE files.files_data
      SET name = ?
      WHERE id = ?;
      SELECT * FROM files.files_data 
      WHERE id = ?;
      `;

    const params = [name, id, id];

    try {
      const [result] = await this.pool.query(query, params);
      const [, rows] = result;
      const [fileData] = rows;

      return FilesRepository.mapFilesData(fileData);
    } catch (e) {
      console.error(e);
      throw new InternalServerError();
    }
  };
}
