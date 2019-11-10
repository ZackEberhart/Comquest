import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import PostForm from './PostForm.js'



export default class EditBug extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      bid:this.props.navigation.state.params.bid,
      loading:false
    };
  }

  getBug = async() =>{
    this.setState({loading:true})
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/getbug?bid="+this.state.bid, {
      method: "GET",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log("bug succes", response);
        await this.setState({bug:response})
        console.log(this.state.bug.bid)
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

  title
  lat
  lon
  level
  description
  pic
  status

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
      if(body[key]) data.append(key, body[key]);
    });

    return data;
  };

  
  handleUploadPhoto = async (photo, body) => {
    this.setState({loading:true})
    console.log(photo)
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/editbug", {
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

  editBug = async (state) =>{
    payload = {
      uid:GLOBAL.UID,
      bugid:this.state.bid,
      title:state.title,
      description:state.desc,
    }
    await this.handleUploadPhoto(state.image, payload)
    console.log(payload)
    if(this.props.bid){
      this.props.navigation.replace("ShowBug", {bid:this.state.bid})
    }
  }

  render(){
    let { image } = this.state;
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
        <PostForm 
          callback={this.editBug}
          bug = {this.bug}
          location
        />
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



