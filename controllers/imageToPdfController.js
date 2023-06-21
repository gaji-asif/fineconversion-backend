const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");
const catchAsyncError = require("../middlewares/catchAsyncError");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Function to check the file extension
const checkExtension = (fileName) => {
  const allowedExtensions = [".jpg"];
  const fileExtension = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(fileExtension);
};


exports.imageToPdf = catchAsyncError(async (req, res, next) => {
  try {
    const images = req.files;

    if (!images) {
      return res.status(400).json({ error: "No images found" });
    }

    // Check total file size
    const totalFileSize = Object.values(images).reduce(
      (acc, file) => acc + file.size,
      0,
    );
    if (totalFileSize > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ error: "Total file size exceeds the limit" });
    }

    // Check file extensions
    for (let i = 0; i < images.length; i++) {
      if (!checkExtension(images[i].originalname)) {
        return res.status(400).json({ error: "Invalid file extension" });
      }
    }

    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < images.length; i++) {
      const imageBytes = await fs.readFile(images[i].path);
      const image = await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.addPage();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }

    const pdfBytes = await pdfDoc.save();

    const publicDirPath = path.join(__dirname, "../public");
    const filePath = path.join(publicDirPath, "converted.pdf");

    // Create the public directory if it doesn't exist
    await fs.mkdir(publicDirPath, { recursive: true });

    await fs.writeFile(filePath, pdfBytes);

    // const downloadLink = `${req.protocol}://${req.get("host")}/converted.pdf`;

    // res.set({
    //   "Content-Type": "application/pdf",
    //   "Content-Disposition": 'attachment; filename="converted.pdf"',
    // });
    // res.send(pdfBytes);
    res.status(200).json({ success: true });

  

    // Trigger the browser to download the PDF document
    // download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Failed to convert images to PDF" });
  }
});
