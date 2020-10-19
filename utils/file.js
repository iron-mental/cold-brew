const multer = require('multer');
const path = require('path');
const uuidv4 = require('uuid').v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images/'.concat(req.baseUrl.split('/').splice(-1)[0])));
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
      cb({ status: 422, message: `File extension Error: [${ext}] is not allow` }, false);
    } else {
      cb(null, true);
    }
  },
}).single('image');

const imageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // 익스텐션 에러
      return next(err);
    } else {
      return next();
    }
  });
};

module.exports = { imageUpload };
