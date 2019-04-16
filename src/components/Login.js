import React from 'react'
import { StyleSheet, Text, TextInput, View,  TouchableOpacity,  Button ,Image} from 'react-native'
import firebase from 'react-native-firebase'

var FBLoginButton = require('./FacebookLogin/FBLoginButton');

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {
    const { email, pasword } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  
  handleFbLogin = () => (
    Auth.Facebook.login(fbLoginPermissions)
      .then((token) => {
        firebase.auth()
          .signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token))
      })
      .catch((err) => this.onError && this.onError(err))
  );

  render() {
    return (
      <View style={styles.container}>
                <View
          style={{
            flex: 1
          }}
        >
          <Image
            resizeMode="contain"
            style={[
              {
                width: '100%',
                height: '100%',
                overflow: 'visible',
                justifyContent: 'center',
              }
            ]}
            source={require('../images/logo2.png')}
          />
        </View>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
         <TouchableOpacity
          onPress={() => {
            this.handleLogin();
          }}
          style={[styles.button]}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
          <Image
            resizeMode="contain" 
            source={require('../images/facebook-button.png')} 
            style={[
              {
                flex:1,
                width: '80%',
                height: '80%',
              }
            ]} />
        </View>
        <Text style={{ alignSelf: 'center', color: '#A6A8A9', fontSize: 15 }}>
          Don’t have an account yet ?
        </Text>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            height: 34,
            justifyContent: 'center'
          }}
          onPress={() => this.props.navigation.navigate('SignUp')}
        >
          <Text style={{ color: '#0D92CA', fontSize: 15 }}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 18
  },
  logo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  textInput: {
    height: 60,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ECF0F3',
    paddingHorizontal: 19
  },
  button: {
    height: 60,
    borderRadius: 3,
    backgroundColor: '#11B8FF',
    justifyContent: 'center',
    alignItems: 'center',
  }
})