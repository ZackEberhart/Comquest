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
    };
  }

  componentWillMount = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
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
        >
          <Marker
            ref={ref => {
              this.marker1 = ref;
            }}
            coordinate={{latitude: this.state.region.latitude + .02, longitude: this.state.region.longitude-.01}}
            title="This is a native view"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
          />
        </MapView>
        <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => this.props.navigation.navigate("NewBug")}/>
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
});