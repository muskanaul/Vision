/**
 * @flow
 */
import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, NativeModules, View, Vibration} from 'react-native';
import { RNCamera } from 'react-native-camera';
import PixelColor from 'react-native-pixel-color';
import ViewShot from "react-native-view-shot";

var Sound = require('react-native-sound');
var Color = require('color');

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      borderRadius: 5,
      padding: 15,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });

export default class Camera extends PureComponent {
    state = {
        isCapturing: false,
        timer: null,
        current_b64: null,
        current_x: 0,
        current_y: 0,
        isTouchReleased: false,
    }

    toggleCapture() {
        if (this.camera) {
        this.setState({
            isCapturing: !this.state.isCapturing,
        })
        if(!this.state.isCapturing){
            let camera_timer = setInterval(this.takePicture, 5000)
            this.setState({
                timer: camera_timer,
            });
            this.takePicture();
        }
        else {
            clearInterval(this.state.timer);
        }
        }
    }
    onTouchStart(event) {
        this.setState({
            isTouchReleased: false
        });
    }
    onTouchEnd(event){
        this.setState({
            isTouchReleased: true
        });

    }
    setVibration(event) {
     console.log(`X Cord: ${event.nativeEvent.locationX}, Y Cord: ${event.nativeEvent.locationY}`)
     if(this.state.current_b64){
        PixelColor.getHex(this.state.current_b64, {x:event.nativeEvent.locationX, y:event.nativeEvent.locationY}).then((color) => { 
            console.log("color: " + color); 
            luminosity = Color(color).luminosity() * 100;
            console.log(luminosity);
            if(!this.state.isTouchReleased){
                console.log("***************************************************************")
                console.log(typeof luminosity);
                if(luminosity >= 25){
                    console.log("high");
                    NativeModules.TouchFeedback.vibrateHigh();
                }
                else if(luminosity < 25 && luminosity >= 10){
                    console.log("med");
                    NativeModules.TouchFeedback.vibrateMedium();
                }
                else if(luminosity < 10 && luminosity >= 1){
                    console.log("lowh");
                    NativeModules.TouchFeedback.vibrateLow();
                }
            }
            //based on if touch has been released
        }).catch((err) => {
          console.log(err);
        });
     }
    }
    playSound= async(url) => {
        console.log("SOUND: url");
        const track = new Sound(url, null, (e) => {
        if (!e) {
         track.play();
        }
        })
    }
    takePicture = async() => {
        const options = { quality: 0.1, base64: true };
        const data = await this.camera.takePictureAsync(options);
        this.processDepthRecognition(data.uri);
    }
    processDepthRecognition(image) {
        //alert("Snapshot captured"+ image);
        var data = new FormData();
        data.append('file', { uri: image, name: image, type: 'image/jpg' });
    
        fetch("https://8c714a8e.ngrok.io/upload/", {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((responseJson) => {
                var err = 'error_message' in responseJson ? true : false
                if (err) {
                    alert(responseJson.error_message)
                } else {
                    //alert(JSON.stringify(responseJson))
                    this.setState({
                        current_b64: 'data:image/jpeg;base64,'+ responseJson.processed_b64
                    })
                }
                //alert("current b64: "+ this.state.current_b64);
                console.log(responseJson);
                if(responseJson.url2Wav){
                    this.playSound(url2Wav);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error)
            });
    
    };
    render() {
        return (
        <View style={styles.container} 
            onTouchStart={(event) => this.onTouchStart(event)}
            onTouchEnd={(event) => this.onTouchEnd(event)}
            onTouchMove={(event) => this.setVibration(event)}>
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.preview}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                playSoundOnCapture={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                >
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.toggleCapture()} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}>{this.state.isCapturing? 'STOP': 'START'}</Text>
                    </TouchableOpacity>
                </View>
            </RNCamera>
        </View>
        );
    }
}
