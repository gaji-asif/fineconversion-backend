const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");

exports.convertToPdf = catchAsyncError(async (req, res, next) => {
  let fileExt = path.extname(req.file.originalname).toLocaleLowerCase();
  fileExt = fileExt === ".docx" ? ".doc" : fileExt;
  fileExt = fileExt === ".xlsx" ? ".xls" : fileExt;

  if (fileExt !== req.body.type) {
    return next(
      new ErrorHandler(`The ${req.body.type} file is only allowed `, 405),
    );
  }

  res.status(200).json({ message: "success" });
});
