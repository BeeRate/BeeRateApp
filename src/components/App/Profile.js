import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon,Text } from 'react-native-elements'
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'

export default class Profile extends Component {

    static navigationOptions = {
        title: 'Profile',
        headerRight:(
          <View style={{margin:15}}>
          <Icon  name='exit-to-app' onPress={() => {
            LoginManager.logOut;
            firebase.auth()
            .signOut()
            .then(() => props.navigation.navigate('Login'))}
            } />
            </View>
          
        ),
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily:'roboto'
        },
        headerVisible: true,
      };

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
