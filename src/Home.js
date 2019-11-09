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
          long:-86.23,
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
      this.getLocalBugs()
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
        latitudeDelta: .05,
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

  getLocalBugs = () =>{
    //Query the database for all bugs based on current region
    bugs = this.state.bugs
    this.setState({bugs})
  }

  addBug = (bugState) =>{
    //Fake method, mocking functionality of adding to a database
    this.setState((prevState)=>{
      return {
        bugs:prevState.bugs.concat([bugState])
      }
    })
    
  }

  render() {
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
            onRegionChangeComplete={this.getLocalBugs}
        >
        {this.state.bugs.map((value, index) => {
          return(
            <Marker
              // ref={ref => {
              //   this.marker1 = ref;
              // }}
              key = {index}
              coordinate={{latitude: value.lat, longitude: value.long}}
              title={value.title}
            >
              <Callout 
                style={styles.plainView}
                onPress={()=>{this.props.navigation.navigate("ShowBug", value.bid)}}
              >
                <View>
                  <Text>This is a plain view</Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
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