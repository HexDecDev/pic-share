import * as dbTools from './app/DBTools';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import download from 'image-downloader';
import multer from 'multer';
import fs from 'fs'
import crypto from 'crypto';
import cookieParser from 'cookie-parser';


const salt = '---'; //Your salt here
var imgFile;

var options = {
    url: '',
    dest:''
}

const validFiles = ['png', 'jpg', 'jpeg'];
   

async function downloadIMG() {
    try {

      
      const { filename, image } = await download.image(options);
      
      return true;  
    } 

    catch (e) {
      console.log(e);
      return false; 
    }
}

function stringGen(len) {
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}
   

const port = 8888;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json() );
//app.use(cors({ origin: '*' }));
app.use(cors({credentials: true, origin: 'http://apb.hexdec.me/'}));
app.use(cookieParser());


dbTools.ConnectToDB();

const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
      cb(null, `${new Date()}-${file.originalname}`);
    },
  });

const upload = multer({ storage });


app.use('/pics/general', express.static(__dirname + '/pics/general/'));


app.get('/', function (req, res) {
  res.send('Я живой!');
});

app.get('/pics', function (req, res) {
    dbTools.getAllPictures().then(data => res.send(data));
});

//.skip(2).limit(5)
app.get('/pics/:skip/:limit/:tags', function (req, res) {
    
    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
    {
        var enablePrivate = (moreData > 0) ? true :false;

        dbTools.getAllPictures(Number(req.params.skip),Number(req.params.limit), req.params.tags, enablePrivate).then(
        
            data => 
            {
                res.send(data)
            });
    })

});


app.get('/search/:string/', function (req, res) {

    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
        {
            var enablePrivate = (moreData > 0) ? true :false;

            dbTools.getPicturesByName(null, null, req.params.string, enablePrivate).then(
                data => 
                {

                    res.send(data)
                });
        })
});


app.get('/search/:string/:skip/:limit', function (req, res) {
    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
        {
            var enablePrivate = (moreData > 0) ? true :false;

            dbTools.getPicturesByName(Number(req.params.skip),Number(req.params.limit), req.params.string, enablePrivate).then(
                data => 
                {

                    res.send(data)
                });
    })
});

app.get('/pics/:skip/:limit/', function (req, res) {
    
    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
        {
            var enablePrivate = (moreData > 0) ? true :false;

            dbTools.getAllPictures(Number(req.params.skip),Number(req.params.limit), null, enablePrivate).then(
                data => 
                {
                    res.send(data)
                });
    })
});

app.get('/count/:tags', function (req, res) {

    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
        {
            var enablePrivate = (moreData > 0) ? true :false;
            
            dbTools.returnTotalPicsCount(req.params.tags, enablePrivate).then(
                data => 
                {
                    
                    res.send(data)
                });
    })  

});


app.get('/regnew/:name/:passwd', function (req, res) {

    const hash = crypto.createHmac('sha256', salt)
                   .update(req.params.passwd)
                   .digest('hex');


    dbTools.addUser(
        {
            name:req.params.name,
            password: hash
        }
    );

    res.send('New name: ' + req.params.name + ' , New Password: ' + req.params.passwd + "  Generated HMAC: " + hash);
    
 
 });


 app.get('/userbyid/:id', function (req, res)
 {
    dbTools.getUserFromSession(req.params.id).then(
        data =>
        {
            if (data.toString().length > 0)
            res.send (data[0].user.toString());
            else res.send(403);
        }
    )
    
    
 });

 app.get('/removesession/:id', function (req, res)
 {
    dbTools.removeSession(req.params.id).then(
        data =>
        {
            res.send ("success");
        }
    )
 });


 app.get('/login/:name/:passwd', function (req, res) {

    var out;
    dbTools.checkUser(req.params.name).then(
        
        data => 
        {
            if (data > 0) 


            //out += "User Exist";
            dbTools.getUser(req.params.name).then(
                anotherData =>
                {
                    //res.send(anotherData._id.toString());
                    var calcHash = crypto.createHmac('sha256', salt)
                    .update(req.params.passwd)
                    .digest('hex');
                    if (calcHash === anotherData[0].password) 
                    {
                        

                        dbTools.checkSession(anotherData[0].name).then(
                            andAnotherData =>
                            {
                                var name = anotherData[0].name;
                                var sessionID = stringGen(15);
                                var currentDate = new Date();
                                var expDate = new Date();
                                expDate.setDate(currentDate.getDate()+1);
                                res.cookie('sessionID', sessionID, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });

                                if (andAnotherData > 0)
                                {
                                    dbTools.rewriteSession(name, 
                                    {
                                        id: sessionID,
                                        user: name,
                                        setDate: currentDate,
                                        expDate: expDate
                                    }).then(
                                        moreData =>
                                        {
                                            res.send(sessionID);
                                        }
                                    )         
                                }

                                else 
                                {
                                dbTools.setSesstion(
                                    {
                                        id: sessionID,
                                        user: name,
                                        setDate: currentDate,
                                        expDate: expDate
                                    }
                                );
                                res.send(sessionID);
                                }
                            }
                        )
                    }
                    else res.send(403, 'Ошибка в данных авторизации. Попробуйте еще разок.');
                }
            );

            else res.send(403, 'Ошибка в данных авторизации. Попробуйте еще разок.');
        }
    
    
    );

    

 });



app.get('/count', function (req, res) {

    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>
        {
            var enablePrivate = (moreData > 0) ? true :false;
            dbTools.returnTotalPicsCount(null, enablePrivate).then(data => res.send(data.toString()));
        })
 
 });



app.get('/delme/:id', function (req, res) {
    dbTools.checkSessionByCookie(req.cookies.sessionID).then( moreData =>

        {
            var enablePrivate = (moreData > 0) ? true :false;
            if (enablePrivate)
            {

                //Тут могла бы быть проверка айдишника там, вот это все. Но ее не будет. 
                //dbTools.deletePicture(req.params.id).then
                //(data => res.send('ok'));
                dbTools.getPictureByID(req.params.id).then (data => 
                    {
                        var filetodelpath = __dirname + '/pics/general/' + data.filename;

                        fs.unlink(filetodelpath, function(error) {
                            if (error) {
                                throw error;
                            }  
                        });
                        
                        dbTools.deletePicture(req.params.id).then (fuckinData => 
                        {
                            res.send('ok');
                        })
                    }
                );
                
            }
            else res.send('deny');

            //dbTools.returnTotalPicsCount(null, enablePrivate).then(data => res.send(data.toString()));
        })
    
})


app.post('/uploadfromdevice', upload.single('file'), (req, res) => {

    var filename = stringGen(9) + '.' + req.file.originalname.split('.').reverse()[0];


    fs.rename(__dirname + '/' + req.file.path, __dirname + '/files/' + filename, (err) => {
        if (err) res.send ("error");
        
        fs.copyFile(__dirname + '/files/' + filename, __dirname + '/pics/' + req.body.category +'/'+ filename, (err) => {
            if (err) res.send ("error");

            dbTools.addPicture(
                {
                    name:req.body.name,
                    filename:filename,
                    tags:req.body.tags,
                    category:req.body.category,
                    privateContent:req.body.privateContent
                }
            );

            res.send("success");



          });
      });

});

app.post('/uploadonlink', (req, res) => {

    //console.log(req.body);
    //Download image form a link
    options.url = req.body.link;
    var seed = stringGen(9);
    var fileformat = options.url.split('.').reverse()[0];
    options.dest= __dirname + '/pics/' + req.body.category +'/'+ seed + "." +fileformat;

    //Upload a file from HDD
    //if (req.body.fileToUpload) console.log(req.body.fileToUpload);

    if (validFiles.indexOf(fileformat) > -1) {

            downloadIMG();
            dbTools.addPicture(
                {
                    name:req.body.name,
                    filename:seed + "." +fileformat,
                    tags:req.body.tags,
                    category:req.body.category,
                    privateContent:req.body.privateContent
                }
            );

            res.send("success");
        }

        else 
        {
            res.send ("error");
        }

});

app.listen(port,  () => {
  console.log('Сервер запущен! Слушаем порт ' + port);
});