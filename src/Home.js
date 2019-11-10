GLOBAL = require('./globals');
import React from 'react';
import { StyleSheet, Button, Alert, TouchableNativeFeedback, Modal, Image, Text, View, Dimensions, Platform, FlatList, BackHandler} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Icon } from 'react-native-elements'
import FAB from 'react-native-fab'
import BottomDrawer from 'rn-bottom-drawer';
import MapView, {
  Marker,
  Callout,
  CalloutSubview,
  ProviderPropType,
}  from 'react-native-maps';

export default class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      location: null,
      errorMessage: null,
      isVisible:true,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      bugs: [
        {
          bid: "samplebug", 
          lat:41.69764,
          lon:-86.23,
          title:"Cool bug",
          lvl:9001
        }
      ]
    };
  }

  componentWillMount = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    }else{
      // this.getLocalBugs()
    }
  }

  getCurrentLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return
    }
    let location = await Location.getCurrentPositionAsync({});
    let region = {
        latitude: parseFloat(location.coords.latitude),
        longitude: parseFloat(location.coords.longitude),
        latitudeDelta: .1,
        longitudeDelta: .05
    };
    await this.setState({
        region: region
    });
  };

  moveToCurrent = async (dur=1) =>{
    await this.getCurrentLocation()
    this.map.animateToRegion(
      this.state.region,
      dur
    )
  }

  closeModal = () =>{
    this.setState({isVisible:false})
  }

  getLocalBugs = async() =>{
    this.setState({loading:true})
    await fetch("http://ec2-3-133-139-55.us-east-2.compute.amazonaws.com/api/v1/getlocal?minlon="+ String(this.state.region.longitude-this.state.region.longitudeDelta)
                + "&maxlon=" + String(this.state.region.longitude+this.state.region.longitudeDelta )
                + "&minlat=" + String(this.state.region.latitude-this.state.region.latitudeDelta )
                + "&maxlat=" + String(this.state.region.latitude+this.state.region.latitudeDelta),{
      method: "GET",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log("items sucfdsfds");
        await this.setState({bugs:response})
      })
      .catch(error => {
        console.log("bug get error", error);
        return null
      })
  }

  addBug = (bugState) =>{
    //Fake method, mocking functionality of adding to a database
    this.setState((prevState)=>{
      return {
        bugs:prevState.bugs.concat([bugState])
      }
    })
  }

  onMapChange = async (region) =>{
    await this.setState({
        region: region
    });
    this.getLocalBugs()

  }

  render() {
    bugs = this.state.bugs
    markers = bugs.map((value, index) => {
      return(
        <Marker
          key = {index}
          coordinate={{latitude: parseFloat(value.lat), longitude: parseFloat(value.lon)}}
          title={value.title}
        >
          <Callout 
            style={styles.plainView}
            onPress={()=>{console.log(value.bid); this.props.navigation.navigate("ShowBug", {bid:value.bid})}}
          >
            <View>
              <Text>This is a plain view</Text>
            </View>
          </Callout>
        </Marker>
      )
    })
    return(
      <View style={styles.container}>
        <MapView
            style={styles.mapStyle}
            maptype = {"terrain"}
            ref={(map) => { this.map = map;}}
            zoomEnabled={true}
            showsUserLocation={true}
            initialRegion={this.state.region}
            onMapReady={this.moveToCurrent}
            onRegionChangeComplete={this.onMapChange}
        >

        {markers}
        </MapView>
        <FAB 
          buttonColor="red" 
          iconTextColor="#FFFFFF" 
          onClickAction={() => this.props.navigation.navigate("NewBug", {callback:this.addBug, region:this.state.region})}
        />
      </View>
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  plainView: {
    width: 200,
  },
});