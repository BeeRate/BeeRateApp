import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createStackNavigator,createAppContainer } from 'react-navigation'

import Loading from './src/components/Loading'
import SignUp from './src/components/SignUp'
import Login from './src/components/Login'
import Main from './src/components/Main'

const AppNavigator = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main
  },
  {
    initialRouteName: 'Loading'
  },
  {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
  }
)

export default createAppContainer(AppNavigator);
