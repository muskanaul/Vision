# htn-2019

## Inspiration
We were inspired by the Azure cognitive services' ability to provide services for the disabled community.  We wanted to build an immersive experience for the visually impaired to gain vision through sense and sound, which we applied using depth perception and Azure's cognitive services.

## What it does
We want to enable everyone to have the chance to see, so we built an app that helps for spacial awareness by giving vibrations according to the proximity of certain objects from the perspective of their camera and by using Azure's Cognitive services API to describe their surroundings.

## How we built it
We used React Native to build a cross-platform experience, for the purpose of the hackathon, we focused on the iOS app. We also used native bridging from Swift to the JS thread to leverage the iOS vibrations functionality in order to provide a native experience for the users . In addition, we utilized color and image processing to differentiate between different depths. We also integrated audio playback which describes the surroundings of the room to the user. 

For the back-end, we used node to communicate with python to process the image, while getting image recognition and text to speech data from Azure Cognitive services. We used low level image processing libraries to resize the image, and lower its quality for faster processing through the trained model.

For training the depth recognition data set we used a pretrained neural network that helps us detect depth based on a single image.

## Challenges we ran into
We ran into several hurdles along the way; firstly being able to set up the data set and training it. It was a new experience for everyone on the team, and we were not familiar with how training pretrained neural network worked.
React Native also had its difficulties, the main one being able to support vibrations. For the team, the only eligible iOS device was an iPhone 6s running iOS 12, which does not natively have haptic feedback. In addition certain versions of React-Native did not support the React Native built in Vibration API or even other third party libraries. In the end, we decided to integrate native bridging between JS and Swift, and wrote the vibration functionality in Swift. 

In addition, on iOS natively, each camera capture is required to create a shutter effect sound, we attempted to programmatically screenshot the screen to avoid the shutter effect, but that did not pair well with the react-native-camera library we were using. Instead, we integrated the camera to continuously poll and take pictures. The user also has the ability to "start/stop" camera captures as well. 

Azure API turned out to be more difficult than we initially assumed, we went through a lot of trial and error when testing the API, we even got our account suspended. 

## Accomplishments that we're proud of
We came up with our idea quite late into the game, which left us with very little time to hack.
* With less than an hour, completed the project, and got a working demo.
* Reduced the amount of time to process one frame from 20 seconds to under 4
* Had lots of fun in the process!

## What we learned
* How to create a react native bridge with swift (very cool)
* Finding a data set and training the

## What's next for Vision - Seeing through sense and sound
* With a more powerful phone (phone with 2 cameras), depth sensing and true haptic feedback would be dramatically improved
* Process more frames real time to provide a more smooth experience
