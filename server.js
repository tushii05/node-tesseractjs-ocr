const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
var Tesseract = require('tesseract.js');

//middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const PORT = process.env.PORT | 3000;

var Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/images');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).single('image');
//route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', (req, res) => {
  console.log(req.file);
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return res.send('Something went wrong');
    }

    var image = fs.readFileSync(
      __dirname + '/images/' + req.file.originalname,
      {
        encoding: null
      }
    );
    Tesseract.recognize(image, 'eng', {
      lang: 'eng',
      tessedit_ocr_engine_mode: 1,
      psm: 6,
    })
      .progress(function (p) {
        console.log('progress', p);
      })
      .then(function (result) {
        res.send(result.html);
      });
  });
});

app.get('/showdata', (req, res) => { });

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

//-----------------------------------------------------------

// const express = require('express');
// const multer = require('multer');
// const app = express();
// const fs = require('fs');
// var Tesseract = require('tesseract.js');

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());

// const PORT = process.env.PORT | 3000;

// var Storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, __dirname + '/images');
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   }
// });

// var upload = multer({
//   storage: Storage
// }).single('image');

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.post('/upload', (req, res) => {
//   console.log(req.file);
//   upload(req, res, err => {
//     if (err) {
//       console.log(err);
//       return res.send('Something went wrong');
//     }

//     var image = fs.readFileSync(
//       __dirname + '/images/' + req.file.originalname,
//       {
//         encoding: null
//       }
//     );
//     try {
//       var result = Tesseract.recognize(image);
//       res.send(result.html);
//     } catch (error) {
//       console.log(error);
//       res.send('Error recognizing text');
//     }
//   });
// });


// app.listen(PORT, () => {
//   console.log(`Server running on Port ${PORT}`);
// });

