import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Platform, StatusBar, FlatList, Modal, Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import PostForm from './src/PostForm.js'


export default class NewBug extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    };
  }

  submitBug = (state) =>{
    console.log(state)
  }

  render(){
    let { image } = this.state;
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
        <Postform callback={this.submitBug}/>
      </View>
    )
  }
}

// const styles = StyleSheet.create({
 
// });



