import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class PostForm extends React.Component {

  constructor(props){
    super(props);
    // this.state={
    //   selectedColorIndex:0,
    //   selectedColor:"#a21344",
    //   boardColors:appStore.boardColors,
    // }
    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  // close = () =>{
  //   this.props.callback()
  // }

  render(){
    let { image } = this.state;
    return(
      <View>
        <Text> Title </Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        />
        <Text> Picture </Text>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <View>
          <Text> {this.state.image} </Text>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          </View>
        }
        <Text> Description </Text>
        <TextInput
          multiline
          numberOfLines={4}
          textAlignVertical='top'
          style={{  borderColor: 'gray',borderWidth: 1 }}
        />
        <Button
          onPress = {()=>this.props.callback(this.state)}
          title="Submit"
        />
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



