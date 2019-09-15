const express = require('express')
const multer = require('multer')
const upload = multer({dest: __dirname + '/uploads/images'});
const fs = require('fs')
const app = express()
const port = 3000
const getDepth = require('./helpers/depth').getDepth

app.use(express.static(__dirname + '/uploads'));

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));




app.post('/upload', upload.single('file'),async (req, res) => {
    let returnObj = {}
    console.log(req.file)
    //save file
    if(req.file) {
        const temp = await getDepth(req.file.path)
        returnObj.processed_url = req.get('Host') + `/images/${req.file.filename}_processed.jpg`
        returnObj.processed_b64 = await fs.readFileSync(`./uploads/images/${req.file.filename}_processed.jpg`, 'base64');
        res.json(returnObj);
    }
    else{
        throw 'No file was submitted';
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))