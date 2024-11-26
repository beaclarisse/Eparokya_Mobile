const multer = require("multer");
const path = require("path");

const FILE_TYPE_MAP = {
    image: [".jpg", ".jpeg", ".png"],
    file: [".pdf"],
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Temporary local storage
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname.split(" ").join("-");
        cb(null, `${Date.now()}-${sanitizedName}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
        FILE_TYPE_MAP.image.includes(ext) ||
        FILE_TYPE_MAP.file.includes(ext)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter,
});

module.exports = upload;
