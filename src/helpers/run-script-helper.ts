import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";

import Constants from "../constants";
import { HttpException } from "@nestjs/common";

class RunScriptHelper {
  public pdfPreviewPageToBase64(pdfName: string, id: string): void {
    const scriptLocation = path.join(
      __dirname,
      "../../../scripts",
      "pdf-page-to-png-script",
      `${Constants.scriptNames.pdfPageToPngScript}.py`,
    );
    const pdfFileLocation = path.join(
      __dirname,
      "../../../uploads",
      "pdf",
      pdfName,
    );
    const process = spawn("python", [scriptLocation, pdfFileLocation]);

    process.stdout.on("data", (data: Buffer) => {
      if (data) {
        const fileDir = path.join(__dirname, "../../../uploads/first-pages");
        if (!fs.existsSync(fileDir)) {
          fs.mkdir(fileDir, (e) => {
            throw new HttpException(
              "Failed to create tmp dir. Detail: " + e,
              400,
            );
          });
        }
        fs.writeFile(path.join(fileDir, `page-${id}`), data, (e) => {
          if (e) {
            throw new HttpException(
              "Failed to write file of first page. Detail: " + e,
              400,
            );
          }
        });
      }
    });
  }
}

export default RunScriptHelper;
