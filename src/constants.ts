const apiPrefix = "api/v1";

const Constants = Object.freeze({
  apiPrefix: apiPrefix,

  refreshTokenOptions: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },

  scriptNames: {
    pdfPageToPngScript: "pdf-page-to-png-script",
  },
});

export default Constants;
