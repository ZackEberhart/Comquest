import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';


export default class PostForm extends React.Component {

  constructor(props){
    super(props);
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
      console.log(result)
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri, [{resize:{width:500}}], { compress: .7, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log(manipResult)

      this.setState({ image: manipResult });
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
          onChangeText={(title) => this.setState({title})}
          value={this.state.title}
          defaultValue={this.state.bug?this.state.bug.title:""}
        />
        <Text> Picture </Text>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <View>
          <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
          </View>
        }
        <Text> Description </Text>
        <TextInput
          multiline
          numberOfLines={4}
          textAlignVertical='top'
          style={{  borderColor: 'gray',borderWidth: 1 }}
          onChangeText={(desc) => this.setState({desc})}
          value={this.state.desc}
          defaultValue={this.state.bug?this.state.bug.desc:""}
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



