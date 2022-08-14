import * as path from 'path';
import * as fs from 'fs/promises';
import { constants } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import FileNotFoundError from './errors/fileNotFound.js';

export default class FilesService {
  constructor(filesRepository, pathToStorage) {
    this.filesRepository = filesRepository;
    this.pathToStorage = pathToStorage;
  }

  static sanitizeFile = ({
    createdAt, updatedAt, ...fileData
  }) => ({ ...fileData, uploadDate: createdAt });

  checkStorageExisting = async () => {
    try {
      await fs.access(this.pathToStorage, constants.F_OK);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  uploadFile = async ({ file }) => {
    const {
      originalname, buffer, mimetype, size,
    } = file;
    const fileExtension = path.extname(originalname);
    const fileName = originalname.split('.').shift();
    const storageKey = uuidv4();
    const isStorageDirExist = await this.checkStorageExisting();

    if (!isStorageDirExist) {
      await fs.mkdir(this.pathToStorage, { recursive: true });
    }

    await fs.writeFile(
      path.resolve(this.pathToStorage, (storageKey + fileExtension)),
      buffer,
    );

    const fileData = await this.filesRepository.createFileData({
      storageKey, fileName, mimetype, fileExtension, size,
    });

    return FilesService.sanitizeFile(fileData);
  };

  downloadFile = async (id) => {
    const fileData = await this.filesRepository.getFileData(id);
    if (!fileData) {
      throw new FileNotFoundError(id);
    }
    const { extension, mimetype, size } = fileData;
    const pathToFile = path.join(this.pathToStorage, `${id}${extension}`);
    const file = await fs.readFile(pathToFile);

    return { file, mimetype, size };
  };

  deleteFile = async (id) => {
    const deletedFileData = await this.filesRepository.deleteFileData(id);

    if (!deletedFileData) {
      throw new FileNotFoundError(id);
    }

    const { extension } = deletedFileData;

    const pathToFile = path.join(this.pathToStorage, `${id}${extension}`);

    await fs.rm(pathToFile);
  };

  getFileDataList = async ({ listSize, page }) => {
    const offset = (page - 1) * listSize;
    const limit = listSize;

    const list = await this.filesRepository.getFileListData({ limit, offset });

    return list.map(FilesService.sanitizeFile);
  };

  getFileData = async (id) => {
    const fileData = await this.filesRepository.getFileData(id);

    if (!fileData) {
      throw new FileNotFoundError(id);
    }

    return FilesService.sanitizeFile(fileData);
  };

  updateFileData = async (data) => {
    const { id, name } = data;
    const oldFileData = await this.filesRepository.getFileData(id);
    if (!oldFileData) {
      throw new FileNotFoundError(id);
    }
    const updatedFileData = await this.filesRepository.updateFileData({ id, name });

    return FilesService.sanitizeFile(updatedFileData);
  };
}
