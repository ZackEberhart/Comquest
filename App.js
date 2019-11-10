GLOBAL = require('./src/globals');
import React from 'react';
import { StyleSheet, Text, StatusBar, View, Platform} from 'react-native';
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { MenuProvider } from 'react-native-popup-menu';
import Home from './src/Home.js'
import NewBug from './src/NewBug.js'
import EditBug from './src/EditBug.js'
import ShowBug from './src/ShowBug.js'
import Profile from './src/Profile.js'


const TabNavigator = createMaterialTopTabNavigator(
  {
    Home: {screen:Home},
    Profile: {screen:Profile},
  },
  {
    tabBarOptions: {
      style: {
        borderTopWidth: 24,
      },
    }
  }
);

const StackNavigator = createStackNavigator(
  {
    Home: {screen:TabNavigator},
    NewBug: {screen:NewBug},
    EditBug: {screen:EditBug},
    ShowBug: {screen:ShowBug},
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      // title: 'Tsuku!',
      header:null,
      headerStyle: {
        height:0,
        backgroundColor: '#0D1B1E',
      },
      style: {
        borderTopWidth: 24,
      },
      headerTintColor: '#FBFFFE',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    headerLayoutPreset:'center',
  }
);

const AppContainer = createAppContainer(StackNavigator);


export default class App extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return(
      <MenuProvider backHandler={true}>
        <AppContainer />
      </MenuProvider>
    ) 
  }
}