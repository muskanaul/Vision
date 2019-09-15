const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/images' });
const fs = require('fs')
const axios = require('axios')

const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3000
const getDepth = require('./helpers/depth').getDepth

app.use(express.static(__dirname + '/uploads'));

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), async (req, res) => {
    let returnObj = {}

    if(req.file) {
        console.log(req.file)
        // console.log(__dirname+"/"+req.file.path)
        azureInfo = await callAzure(__dirname+"/"+req.file.path);

        const temp = await getDepth(__dirname+"/"+req.file.path)
        returnObj.processed_url = req.get('Host') + `/images/${req.file.filename}_processed.jpg`
        returnObj.processed_b64 = await fs.readFileSync(`./uploads/images/${req.file.filename}_processed.jpg`, 'base64');
        returnObj.azureInfo = azureInfo
        res.json(returnObj);
    }
    else{
        throw 'No file was submitted';
    }
});

app.listen(port, () => console.log(`Example app listening on port1 ${port}!`))

//headers for Azure/Axios
const headers = {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': process.env.API_KEY
}

//helper function for fetching azure to avoid merging issues
async function callAzure(imageDestination){
    imageBase64 = fs.createReadStream(imageDestination)
    response = await axios({
        method: 'post',
        url: process.env.API_URL+'/vision/v1.0/describe?maxCandidates=1', 
        headers: headers,
        data: imageBase64
    });
    console.log(response.data.description.captions[0].text);
    return response.data;
}