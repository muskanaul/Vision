/**
 * @flow
 */
import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, NativeModules, View, Vibration} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { captureScreen } from "react-native-view-shot";
 
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
        isCapturing: false
    }
    takePicture(){
        if (this.camera) {
        this.setState({
            isCapturing: !this.state.isCapturing
        })
        //const options = { quality: 0.5, base64: true };
        //const data = await this.camera.takePictureAsync(options);
        //this.processDepthRecognition(data);
        captureScreen({
            format: "jpg",
            quality: 0.8
        }).then(
            uri => this.processDepthRecognition(uri),
            error => alert("Oops, snapshot failed" + error)
            );
        }
    };
    processDepthRecognition(image) {
        alert("Snapshot captured"+ image);
        var data = new FormData();
        data.append('file', { uri: image, name: image, type: 'image/jpg' });
    
        fetch("https://ce4ee619.ngrok.io/upload/", {
            method: 'POST',
            body: data
        })
            .then((response) => response.json())
            .then((responseJson) => {
                var err = 'error_message' in responseJson ? true : false
                if (err) {
                    alert(responseJson.error_message)
                } else {
                    alert(JSON.stringify(responseJson))
                }
    
            })
            .catch((error) => {
                console.error(error);
                alert(error)
            });
    
    };
    render() {
        return (
        <View style={styles.container} onMoveShouldSetResponder={(event) => console.log(`X Cord: ${event.nativeEvent.locationX}, Y Cord: ${event.nativeEvent.locationY}`)}>
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
        </RNCamera>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.takePicture()} style={styles.capture}>
                <Text style={{ fontSize: 14 }}>{this.state.isCapturing? 'STOP': 'START'}</Text>
            </TouchableOpacity>
        </View>
        </View>
        );
    }
}
