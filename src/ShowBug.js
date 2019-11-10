GLOBAL = require('./globals');
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Platform, StatusBar, TouchableWithoutFeedback, TouchableOpacity, FlatList, Modal, Button, Alert} from 'react-native';
import NewComment from './NewComment.js'
import MapView, {
  Marker,
  Callout,
  CalloutSubview,
  ProviderPropType,
}  from 'react-native-maps';

export default class ShowBug extends React.Component {

  constructor(props){
    super(props);
    this.state={
      bug:{},
      comments:[],
      bid:this.props.navigation.state.params.bid
    }
  }

  componentWillMount = async () => {
    console.log(this.props.navigation.state.params.bid)
    await this.getBug()
    await this.checkUpvote()
    await this.getComments()
    await this.getUsers()
  }

  createFormData = () => {
    const data = new FormData();
    data.append({bid:this.state.bid})
    return data;
  };

  getBug = async() =>{
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
        console.log(this.state.bug)
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

  checkUpvote = async() =>{
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

  getUsers = async() =>{
    comments = this.state.comments
    console.log("in users time :)")
    comments.map(async (value, index) => {
      console.log(value.uid)
      await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/userprofile?bid="+ value.uid,{
        method: "GET",
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.json())
      .then( response => {
        console.log("users success", response);
        console.log("users Got comments tho");
        comments[index].username = response.username
      })
      .catch(error => {
        console.log("users get error", error);
        return null
      })
      console.log(comments)
      this.setState({comments})
    })
  }

  getMapBox = () =>{
    return(
      <MapView
            style={styles.mapSquare}
            zoomEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            showsUserLocation={true}
            showsCompass={false}
            initialRegion={{
              latitude:parseFloat(this.state.bug.lat),
              longitude:parseFloat(this.state.bug.lon),
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }
            }
            onMapReady={this.moveToCurrent}
            onRegionChangeComplete={this.onMapChange}
        >
          <Marker
            coordinate={{latitude: parseFloat(this.state.bug.lat), longitude: parseFloat(this.state.bug.lon)}}
          />
        </MapView>
    )
  }

  render(){
    return(
      <ScrollView 
      contentContainerStyle={{
          flexGrow: 1,
      }} 
      style={{ padding:10, paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight +10: 10 }}>
        {this.state.bug.uid == GLOBAL.UID &&
          <Button
            onPress={()=>{this.props.navigation.navigate("EditBug", {bug:this.state.bug, bid:this.state.bid})}}
            title = "Edit bug"
          />
        }
        <View >
          <View style = {{flexDirection:'row', height:100}}>
            {this.state.bug.lat && this.getMapBox()}
            <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:20, fontWeight:'bold'}}> {this.state.bug.title} </Text>
            </View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Text> {this.state.upvoted} </Text>
            </View>
          </View>
           <View style={{height:10}}/>
          {this.state.bug.pic &&
            <View style = {{flexDirection:'row', height:300}}> 
              <Image source={{uri:this.state.bug.pic}} style={{ flex:1}}/>
            </View>
          }
          <Text style={{fontWeight:'bold'}}> Description </Text>
          <View style={{padding:5}}>
            <Text> {(this.state.bug.description&&this.state.bug.description!="undefined")? this.state.bug.description: "[No desciption provided]"} </Text>
          </View>
          <View style={{height:10}}/>
          <View
            style={{
              borderBottomColor: '#d0d0d0',
              borderBottomWidth: 1,
            }}
          >
            <Text style={{fontWeight:'bold'}}> Discussion </Text>
          </View>
          <View style={{padding:6}}>
            {this.state.comments.map((value, index) => {
              return(
                <Text key = {index}>
                  {value.text}
                </Text>
              )
            })}
          </View>
        </View>
        
        <NewComment bid={this.state.bid}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
   mapSquare: {
    flex: 2,
    // width: 100,
    // height: 100
  },
});