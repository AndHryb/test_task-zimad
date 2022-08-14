import { StatusCodes } from 'http-status-codes';

export default class FilesController {
  constructor(filesService) {
    this.filesService = filesService;
  }

  uploadFile = async (req, res) => {
    const { file } = req;

    const fileData = await this.filesService.uploadFile({ file });

    res.status(StatusCodes.CREATED).json(fileData);
  };

  downloadFile = async (req, res) => {
    const { params: { id } } = req;

    const { file, mimetype, size } = await this.filesService.downloadFile(id);

    res.set({
      'Accept-Ranges': 'bytes',
      'Content-Length': size,
      'Content-Type': mimetype,
    });

    res.status(StatusCodes.OK).send(file);
  };

  deleteFile = async (req, res) => {
    const { params: { id } } = req;
    await this.filesService.deleteFile(id);

    res.status(StatusCodes.NO_CONTENT).send();
  };

  getFileDataList = async (req, res) => {
    const {
      query: {
        list_size: listSize = 10,
        page = 1,
      },
    } = req;

    const list = await this.filesService.getFileDataList({ listSize, page });

    res.status(StatusCodes.OK).json(list);
  };

  getFileData = async (req, res) => {
    const { params: { id } } = req;
    const fileData = await this.filesService.getFileData(id);

    res.status(StatusCodes.OK).json(fileData);
  };

  updateFileData = async (req, res) => {
    const { params: { id }, body: { name } } = req;
    const fileData = await this.filesService.updateFileData({ id, name });

    res.status(StatusCodes.OK).json(fileData);
  };
}
