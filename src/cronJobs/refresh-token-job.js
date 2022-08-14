export default class RefreshTokenJobs {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  deleteExpiredTokens = async () => {
    try {
      const rows = await this.authRepository.deleteExpiredTokens(new Date());

      console.log(`${rows} records were deleted`);
    } catch (e) {
      console.error(e);
    }
  };
}
