

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploadFile/'});

const app = express();
app.use(cors());

app.all('/*', function (req, res, next) {
  console.log('begin', req.url);
  if ('/uploadImage' === req.url
    || req.url.startsWith('/downloads')
    || req.url.startsWith('/www')
  ) {
    next();
  } else {
    var url = req.url;
    var queryIndex = req.url.indexOf("?");
    if (queryIndex>-1){
      url =url.substring(0,queryIndex);
    }
    let file = __dirname + url + '.json';
    if (!fs.existsSync(file)) {
      file = "/not-found.json";
    }
    res.json(JSON.parse(fs.readFileSync(file)));
  }


  console.log('end', req.url);
  console.log('end', req.body);
});

app.post('/uploadImage', upload.single('file'), function (req, res) {

  const tmp_path = req.file.path;
  let target_path = 'downloads/'+parseInt(Math.random()*1000000) + req.file.originalname;
  if (target_path.indexOf('.') < 0) {
    target_path += ".jpg";
  }
  fs.copyFileSync(tmp_path, __dirname + "/" + target_path);
  fs.rmSync(tmp_path);

  res.json({
    "elapsedTime": "1.3747",
    "errorCode": 0,
    "errorDesc": "",
    "serverTime": "",
    "data": {
      "url": "http://192.168.0.105:3000/" + target_path
    }
  });
});
app.get('/downloads/*', function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.get('/www/*', function (req, res) {
  res.sendFile(__dirname + req.url);
});
app.listen(3000, function () {
  console.log('server is listening on port 3000');
});
