import multer from "multer";
import path from "path";
import fs from "fs";

// Directory ensure karne ke liye helper function
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "workerPhoto") {
      const dir = "uploads/staffPhotos";
      ensureDirExists(dir);
      cb(null, dir);
    } else if (file.fieldname === "workerIdProof") {
      const dir = "uploads/staffIds";
      ensureDirExists(dir);
      cb(null, dir);
    } else if (file.fieldname === "billProof") {
      const dir = "uploads/billProofs";
      ensureDirExists(dir);
      cb(null, dir);
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
