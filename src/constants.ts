const apiPrefix = "api/v1";

const Constants = Object.freeze({
  apiPrefix: apiPrefix,

  refreshTokenOptions: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },
});

export default Constants;
