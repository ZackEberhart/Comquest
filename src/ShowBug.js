GLOBAL = require('./globals');
import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBar, TouchableWithoutFeedback, TouchableOpacity, FlatList, Modal, Button, Alert} from 'react-native';
import NewComment from './NewComment.js'

export default class ShowBug extends React.Component {

  constructor(props){
    super(props);
    this.state={
      bug:{},
      bid:this.props.navigation.state.params.bid
    }
  }

  componentWillMount = async () => {
    console.log(this.props.navigation.state.params.bid)
    this.getBug()
    this.checkUpvote()
    this.getComments()
  }

  createFormData = () => {
    const data = new FormData();
    data.append({bid:this.state.bid})
    return data;
  };

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

  checkUpvote = async() =>{
    this.setState({loading:true})
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/userupvote?bid="+this.state.bid+"&uid="+GLOBAL.UID, {
      method: "GET",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log("cool we know now", response);
        await this.setState({upvoted:response})
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

  upvote = async() =>{
    this.setState({loading:true})
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/upvote?bid="+this.state.bid+"&uid="+GLOBAL.UID, {
      method: "GET",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log("bug succes", response);
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

   getComments = async() =>{
    this.setState({loading:true})
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/getcomments?bid="+ this.state.bid,{
      method: "GET",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log("items success", response);
        console.log("items Got comments tho");
        await this.setState({comments:response})
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

  render(){
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
        <View>
          {this.state.bug.uid <= 7 &&
            <Button
              onPress={()=>{this.props.navigation.navigate("EditBug", {bug:this.state.bug, bid:this.state.bid})}}
              title = "Edit bug"
            />
          }
          <Text> {this.state.bug.bid} </Text>
          <Text> {this.state.bug.uid} </Text>
          <Text> {this.state.bug.title} </Text>
          <Text> {this.state.bug.pic} </Text>
          <Text> {this.state.bug.description} </Text>
          <Text> {this.state.upvoted} </Text>
          <Button
            onPress={this.upvote}
            title="upvote"
          />
        </View>
        {this.state.comments &&
          <View>
            {this.state.comments.map((value, index) => {
            return(
              <Text key = {index}>
                {value.text}
              </Text>
            )
          })}
          </View>
        }
        <NewComment/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
 
});