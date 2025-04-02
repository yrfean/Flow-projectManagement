import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toLocaleString() + "-" + file.originalname);
  },
});
export const upload = multer({ storage });
