import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBa, TouchableOpacity, FlatList, Modal, Button, Alert} from 'react-native';

export default class NewComment extends React.Component {

  constructor(props){
    super(props);
    // this.state={
    //   selectedColorIndex:0,
    //   selectedColor:"#a21344",
    //   boardColors:appStore.boardColors,
    // }
  }

  // close = () =>{
  //   this.props.callback()
  // }

  render(){
    return(
      <View style={{ paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0 }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
 
});