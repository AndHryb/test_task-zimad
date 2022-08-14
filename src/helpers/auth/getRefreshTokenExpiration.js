export const getRefreshTokenExpiration = (refreshTokenExpireTime) => {
  if (refreshTokenExpireTime <= 0) {
    return null;
  }

  return new Date(refreshTokenExpireTime * 1000 + Date.now());
};
