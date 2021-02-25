require('dotenv').config();

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;

let imagePath = '';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      imagePath = path.join('/images', req.baseUrl.split('/').splice(-1)[0]);
      const dir = path.join(__dirname, '../../public', imagePath);

      !fs.existsSync(dir) && fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const basename = uuidv4();
      const ext = path.extname(file.originalname);
      file.uploadedFile = {
        basename: basename.concat(ext),
        _tmp: basename.concat('_tmp', ext),
      };

      req.body.image = path.join(process.env.DOMAIN, imagePath, file.uploadedFile.basename);

      if (req.method === 'POST') {
        cb(null, file.uploadedFile.basename);
      } else if (req.method === 'PUT') {
        cb(null, file.uploadedFile._tmp);
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb({ status: 422, message: `File extension Error: [${ext}] is not allow` }, false);
    } else {
      cb(null, true);
    }
  },
}).single('image');

const imageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return next(err);
    } else {
      return next();
    }
  });
};

module.exports = {
  imageUpload,
};
