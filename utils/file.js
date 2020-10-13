const multer = require('multer');
const path = require('path');
const uuidv4 = require('uuid').v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images/study'));
    },
    filename: (req, file, cb) => {
      const basename = uuidv4();
      const ext = path.extname(file.originalname);

      file.uploadedFile = {
        basename: basename.concat(ext),
        _tmp: basename.concat('_tmp', ext),
      };

      if (req.method === 'POST') {
        cb(null, file.uploadedFile.basename);
      } else if (req.method === 'PATCH') {
        cb(null, file.uploadedFile._tmp);
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') {
      console.error(`File extension Error: [${ext}] is not allow`);
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
}).single('image');

const imageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (req.file) {
      next();
    } else if (err) {
      next(err);
    } else {
      next({ status: 422, message: `File extension error` });
    }
  });
};

module.exports = { imageUpload };
