import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import firebase from "react-native-firebase";
import { SocialIcon, Input, Button } from "react-native-elements";
import { GoogleSignin } from 'react-native-google-signin';

var loginUtils = require("../Utils/LoginUtils");

export default class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: null
  };

  //Hiding the
  static navigationOptions = {
    headerVisible: false
  };

  //Login To Firebase
  handleLogin = () => {
    if (this.state.email == "" || this.state.password == "") {
      this.setState({
        errorMessage: "Please enter Email and Password"
      });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
        .then(() => this.props.navigation.navigate("Main"))
        .catch(error =>
          this.setState({
            errorMessage: error.message
          })
        );
    }
  };

  //Login To Facebook
  handleFbLogin = () =>{
    loginUtils.facebookLogin().then(() => this.props.navigation.navigate("Main")).catch(error =>
      this.setState({
        errorMessage: error.message
      }))
    };

  //Login To Google
  handleGoogleLogin = () =>{
  loginUtils.googleLogin().then(() => this.props.navigation.navigate("Main")).catch(error =>
    this.setState({
      errorMessage: error.message
    }))
  };

  render() {
    return (
      <View style={styles.container}>
        {/*Logo */}

        <View
          style={{
            flex: 1
          }}
        >
          <Image
            resizeMode="contain"
            style={[
              {
                width: "100%",
                height: "100%",
                overflow: "visible",
                justifyContent: "center"
              }
            ]}
            source={require("../../images/logo2.png")}
          />

        </View>
        
        {/*Error Message */}
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}

        {/*Email */}

        <Input
          placeholder="Email"
          autoCapitalize="none"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        {/*Password */}

        <Input
          placeholder="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          autoCapitalize="none"
          secureTextEntry
        />

        {/*Login Button */}

        <Button
          title="Login"
          onPress={this.handleLogin}
          buttonStyle={{
            color: "white",
            fontSize: 20,
            fontWeight: "600",
            marginTop: 19,
            marginBottom: 19
          }}
        />

        {/*Login with Facebook */}

        <SocialIcon 
        title="Sign In With Facebook"
         button 
         type="facebook"
         onPress={this.handleFbLogin}
         />

        {/*Login with Google */}

        {/* <SocialIcon
          title="Sign In With Google"
          button
          type="google-plus-official"
          onPress={this.handleGoogleLogin}
        /> */}

        {/*Sign Up */}

        <Text
          style={{ alignSelf: "center", color: "#A6A8A9", fontSize: 15 }}
        >
          Don’t have an account yet ?
        </Text>
        <TouchableOpacity
          style={{
            alignSelf: "center",
            height: 34,
            justifyContent: "center"
          }}
          onPress={() => this.props.navigation.navigate("SignUp")}
        >
          <Text style={{ color: "#0D92CA", fontSize: 15 }}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    );
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
    alignItems: "center",
    backgroundColor: "grey"
  },
  textInput: {
    height: 60,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ECF0F3",
    paddingHorizontal: 19
  },
  button: {
    height: 60,
    borderRadius: 3,
    backgroundColor: "#11B8FF",
    justifyContent: "center",
    alignItems: "center"
  }
});
