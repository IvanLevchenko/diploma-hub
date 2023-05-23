import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";

import Constants from "../constants";
import { HttpException } from "@nestjs/common";

interface PlagiarismResult {
  passed: boolean;
  percentOfUniqueness?: number;
}

class RunScriptHelper {
  public pdfPreviewPageToBase64(pdfPath: string, id: string): void {
    const scriptLocation = path.join(
      __dirname,
      "../../../scripts",
      "pdf-page-to-png-script",
      `${Constants.scriptNames.pdfPageToPngScript}.py`,
    );
    const process = spawn("python", [scriptLocation, pdfPath]);

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

  public plagiarismCheck(
    pivotFile: string,
    filesToVerify: string[],
  ): Promise<PlagiarismResult> {
    const scriptLocation = path.join(
      __dirname,
      "../../../scripts",
      "plagiarism-checker-script",
      "main",
    );

    const childProcess = spawn(
      `cd ${scriptLocation} & go run`,
      [
        `${Constants.scriptNames.plagiarismCheckerScript}.go`,
        pivotFile,
        ...filesToVerify,
      ],
      {
        shell: true,
      },
    );

    return new Promise((resolve) => {
      let result: PlagiarismResult;

      childProcess.stdout.on("data", (data: Buffer) => {
        const str = data.toString();
        const payload = str.split(";");

        result = {
          passed: payload.includes("true"),
          percentOfUniqueness: 100 - Number(payload[1]),
        };

        resolve(result);
      });
    });
  }
}

export default RunScriptHelper;
