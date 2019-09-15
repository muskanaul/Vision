const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/images' });
const fs = require('fs')
const axios = require('axios')

const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))


app.use(express.static('public'));

app.post('/upload', upload.single('photo'), async (req, res) => {

    azureInfo = await callAzure(__dirname+"/"+req.file.path);
    console.log(azureInfo)
    
    res.send(azureInfo)
});

app.listen(port, () => console.log(`Example app listening on port1 ${port}!`))


//headers for Azure/Axios
const headers = {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': process.env.API_KEY
  }
  
  console.log(process.env.API_KEY);

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