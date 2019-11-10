GLOBAL = require('./globals');

import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CommentForm from './CommentForm.js'

export default class NewComment extends React.Component {

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
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/comment", {
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

  submitComment = async (state) =>{
    payload = {
      uid:GLOBAL.UID,
      bugid:this.props.bid,
      text:state.text,
    }
    await this.handleUploadPhoto(state.image, payload)
    console.log(this.props.bid)
  }

  render(){
    return(
      <View>
        <CommentForm 
          callback={this.submitComment}
        />
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



