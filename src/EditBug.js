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
    };
  }

  editBug = (state) =>{
    //Check if data is valid
    //If so:
    //  Submit bug to the server
    //  Navigate to the post
    //  Flash success msg
    //If not:
    //  Flash failure msg
    console.log(state)
  }

  render(){
    let { image } = this.state;
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
        <PostForm callback={this.editBug}/>
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



