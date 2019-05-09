import React from 'react'
import { StyleSheet,  TextInput, View,Image } from 'react-native'
import firebase from 'react-native-firebase'
import { Input,Button,Text } from 'react-native-elements'

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  static navigationOptions = {
    headerVisible: false,

  };
handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
}
render() {
    return (
      <View style={styles.container}>
        <Text h1>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <Input
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={{margin:10}}>
        <View style={{margin:10}}>

        <Button title="Sign Up" onPress={this.handleSignUp} />
        </View>

        <View style={{margin:10}}>

        <Button
          title="Already have an account?"
          onPress={() => this.props.navigation.navigate('Login')}
        />
        </View>
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
})