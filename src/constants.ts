const apiPrefix = "api/v1";
const uuidPattern =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const Constants = Object.freeze({
  apiPrefix: apiPrefix,
  uuidPattern: uuidPattern,

  refreshTokenOptions: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },

  scriptNames: {
    pdfPageToPngScript: "pdf-page-to-png-script",
    plagiarismCheckerScript: "main",
  },
});

export default Constants;
