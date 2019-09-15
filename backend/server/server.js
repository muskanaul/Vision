const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/images' });
const fs = require('fs')
const axios = require('axios')
const tts = require('./TTSSample')
const sharp = require('sharp')

const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3000
const getDepth = require('./helpers/depth').getDepth

app.use(express.static(__dirname + '/uploads'));

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));

let prevCaption = ""

app.post('/upload', upload.single('file'), async (req, res) => {
    let returnObj = {}

    if(req.file) {
        console.log(req.file)
        
        const imageBuffer = sharp(__dirname+"/"+req.file.path)
        const metadata = await imageBuffer.metadata()
        // console.log(metadata)
        if(metadata.width > metadata.height){
            // console.log("Rotating")
            imageBuffer.rotate(90)        
        }
        await imageBuffer.resize({ height: 1334, width: 750 }).toFile(__dirname+"/"+req.file.path + "resize")

        
        
        
        const msPromises = new Promise( async (res, rej) => {
            let tempAzureInfo = await callAzure(__dirname+"/"+req.file.path + "resize");
            console.log(tempAzureInfo)
            if(tempAzureInfo !== null && prevCaption !== tempAzureInfo.description.captions[0].text){
                await tts.main(tempAzureInfo.description.captions[0].text)
                prevCaption = tempAzureInfo.description.captions[0].text
                returnObj.url2Wav = "https://8c714a8e.ngrok.io/sounds/TTSOutput.wav"
            }
            res(tempAzureInfo)
        })

        const depthPromise = getDepth(__dirname+"/"+req.file.path + "resize")

        const [ azureData, depthData ] = await Promise.all([msPromises, depthPromise])

        console.log(azureData)

        returnObj.processed_url = req.get('Host') + `/images/${req.file.filename}resize_processed.jpg`
        returnObj.processed_b64 = await fs.readFileSync(`./uploads/images/${req.file.filename}resize_processed.jpg`, 'base64');
        returnObj.azureInfo = azureData
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
    console.log(response.data.description)
    console.log("DATA: " , response.data.description.captions)
    if(response.data.description){
        if(response.data.description.captions){
            if(response.data.description.captions[0]){
                if(response.data.description.captions[0].text){
                    console.log(response.data.description.captions[0].text);
                    return response.data;
                }
            }
        }
    }

    return null;
}