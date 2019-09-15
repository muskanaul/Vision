const express = require('express')
const multer = require('multer')
const upload = multer({dest: __dirname + '/uploads/images'});
const fs = require('fs')
const app = express()
const port = 3000
const getDepth = require('./helpers/depth').getDepth

app.get('/', (req, res) => res.send('Hello World!'))


app.use(express.static('public'));

app.post('/upload', upload.single('photo'), (req, res) => {
    console.log(req.file)
    //save file
    if(req.file) {
        fs.readFile(req.file.path, (err, contents) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(contents)
            }
        })
        res.json(req.file);
    }
    else{
        throw 'error';
    }

    var spawn = require("child_process").spawn; 

    var process = spawn('python',["./hello.py", 
    req.query.firstname, 
    req.query.lastname] ); 

});

// app.listen(port, () => console.log(`Example app listening on port1 ${port}!`))

async function test() {
    const temp = await getDepth("jh")
    console.log("complete")
}

test()