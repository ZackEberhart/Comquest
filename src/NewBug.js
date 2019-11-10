import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import PostForm from './PostForm.js'



export default class NewBug extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false
    };
  }

  createFormData = (photo, body) => {
    const data = new FormData();
    if(photo){
      data.append("image", {
        name: "coolphoto.jpg",
        type: "image/jpeg",
        uri:
          Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  
  handleUploadPhoto = async (photo, body) => {
    this.setState({loading:true})
    console.log(photo)
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/images/uploads3", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: this.createFormData(photo, body)
    })
      .then(response => response.json())
      .then(async response => {
        console.log("upload succes", response);
        alert("Upload success!");
        await this.setState({bid:response.bugid})
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
        return null
      })
  };

  submitBug = async (state) =>{
    payload = {
      uid:GLOBAL.UID,
      title:state.title,
      desc:state.desc,
      lat:this.props.navigation.state.params.region.latitude,
      long:this.props.navigation.state.params.region.longitude,
    }
    await this.handleUploadPhoto(state.image, payload)
    console.log(this.state.bid)
    if(this.state.bid){
      this.props.navigation.replace("ShowBug", {bid:this.state.bid})
    }
  }

  render(){
    let { image } = this.state;
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
        <PostForm 
          callback={this.submitBug}
          location
        />
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



