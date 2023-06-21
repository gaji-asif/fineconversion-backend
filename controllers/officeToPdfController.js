const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const fs = require("fs");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

exports.convertToPdf = catchAsyncError(async (req, res, next) => {
  let fileExt = path.extname(req.file.originalname).toLocaleLowerCase();
  fileExt = fileExt === ".docx" ? ".doc" : fileExt;
  fileExt = fileExt === ".xlsx" ? ".xls" : fileExt;

  if (fileExt !== req.body.type) {
    return next(
      new ErrorHandler(`This ${req.body.type} file is not allowed.`, 405),
    );
  }

  fileExt = path.extname(req.file.originalname);
  const docxBuf = await fs.promises.readFile(req.file.path);
  let outputPath = path.join(
    __dirname,
    "..",
    "public/uploads",
    `${req.file.originalname.replace(fileExt,"").split(" ")
      .join("-") + '-' + Date.now()}.pdf`,
  );

  try {
    const pdfBuf = await libre.convertAsync(docxBuf, ".pdf", undefined);

    await fs.promises.writeFile(outputPath, pdfBuf);

    res.download(outputPath, (err) => {
      if (err) {
        next(new Error("Error occurred during the download process.", 404));
      }

      fs.promises.unlink(req.file.path);
      fs.promises.unlink(outputPath);
    });
  } catch (err) {
    fs.promises.unlink(req.file.path);
    fs.promises.unlink(outputPath);

    next(
      new ErrorHandler("Error occurred during the conversion process.", 404),
    );
  }
});
