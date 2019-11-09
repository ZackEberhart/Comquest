import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBar, TouchableWithoutFeedback, TouchableOpacity, FlatList, Modal, Button, Alert} from 'react-native';

export default class ShowBug extends React.Component {

  constructor(props){
    super(props);
    this.state={
      bid:this.props.navigation.state.params.bid
    }
  }

  componentWillMount = async () => {
    this.getBug()
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

  getComments = async() =>{
    return([
        {
          text:"whoa jeez be careful",
          uid:2,
          bid:this.props.navigation.state.params.bid,
          img:null
        },
        {
          text:"heck I guess I'm just not sure",
          uid:2,
          bid:this.props.navigation.state.params.bid,
          img:null
        }
      ]
    )
  }

  render(){
    return(
      <View style={{ paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0 }}>
      {this.state.bug &&
        <View>
        <Text> {this.state.bug.bid} </Text>
        <Text> {this.state.bug.title} </Text>
        <Text> {this.state.bug.description} </Text>
        </View>
      }

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
      </View>
    )
  }
}

const styles = StyleSheet.create({
 
});