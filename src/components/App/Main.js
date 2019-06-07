import React from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import { Icon, Button, Text, Overlay,Card,Image } from "react-native-elements";
import firebase, { imageRef } from "react-native-firebase";
import BeersList from "./SearchBeerBar";
import { PermissionsAndroid } from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import uuid from "uuid";

export default class Main extends React.Component {
  state = {
    search: "",
    currentUser: null,
    showSearch: false,
    image: null,
    uploading: false,
    googleResponse: null,
  };

  static navigationOptions = ({ navigation }) => ({
    title: "Find Your Beer",
    headerRight: (
      <View style={{ margin: 15 }}>
        <Icon
          name="account-circle"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    ),
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "roboto"
    },
    headerVisible: true
  });

  componentWillUnmount() {
    this.didFocusListener.remove();
  }

  //On launching component
  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const { currentUser } = firebase.auth();
    this.didFocusListener = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.setState({ currentUser,showSearch:false });
      });
    console.disableYellowBox = true;
  }

  uploadImage(uri, mime = "image/jpeg", name) {
    return new Promise((resolve, reject) => {
      Blob = RNFetchBlob.polyfill.Blob;
      fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
      const Fetch = RNFetchBlob.polyfill.Fetch;
      // replace built-in fetch
      window.fetch = new Fetch({
        // enable this option so that the response data conversion handled automatically
        auto: true,
        // when receiving response data, the module will match its Content-Type header
        // with strings in this array. If it contains any one of string in this array,
        // the response body will be considered as binary data and the data will be stored
        // in file system instead of in memory.
        // By default, it only store response data to file system when Content-Type
        // contains string `application/octet`.
        binaryContentTypes: ["image/", "video/", "audio/", "foo/"]
      }).build();
      imgUri = uri;

      const { currentUser } = firebase.auth();
      const imageRef = firebase.storage().ref(`/photos/${currentUser.uid}`);
      fs.readFile(imgUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          return imageRef.put(uri, { contentType: mime, name: name });
        })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
          this.setState({ visionError:true });
        });
    });
  }

// timeout(ms, promise) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       reject(new Error("timeout"))
//     }, ms)
//     promise.then(resolve, reject)
//   })
// }

  submitToGoogle = () => {
    try {

      // Launch Camera:
      ImagePicker.launchCamera({
        quality:0.6,
        title: "Select Avatar",
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: "images"}}, result => {
        if(result.error || result.didCancel){
          return;
        }
        this.setState({ uploading: true ,visionError:false});

        this.uploadImage(result.path).then(fbres => {

          body = JSON.stringify({
            requests: [
              {
                features: [{ type: "LOGO_DETECTION", maxResults: 1 }],
                image: {
                  source: {
                    imageUri: fbres
                  }
                }
              }
            ]
          });

          fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCgArqIrc0V0D0iP1DrzdI4Yo_kUwTB3AM",
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: body
            }
          ).then(res => {
              // console.log(res.body)
              // this.props.navigation.navigate("BeersFound",{
              //   value:res.responses.logoAnnotations[0].description,
              //   criteria:'name'
              // } )
                res.json().then(json => {
                  console.log(json);
                  this.setState({ uploading: false });
                  if (json.responses.length > 0 && json.responses[0].logoAnnotations[0]) {
                    beerName = json.responses[0].logoAnnotations[0].description;
                    console.log(beerName);
                    this.props.navigation.navigate("BeersFound", {
                      value: beerName,
                      criteria: "vision"
                    });
                    this.setState({ visionError:true });

                  } 
                  else{
                    this.setState({ visionError:true });

                  }
                }).catch(e=>{
                  this.setState({ visionError:true });
                })
            })
            .catch((err) => {
              console.log(err); 
              this.setState({ uploading: false ,visionError:true});

          });
        });
      });

      // imguri= this.uploadImage(this.state.resUri,'image/jpeg',response.fileName)
    } catch (error) {
      this.setState({ uploading: false });
    }
  }

  updateSearchState = () => {
    this.setState({ showSearch: !this.state.showSearch });
  };

  render() {
    const { search, currentUser, showSearch } = this.state;

   
    return (
      <ScrollView style={{ flex: 1 }}>
        <Overlay
          isVisible={this.state.uploading}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width="auto"
          height="auto"
        >
          <Text>Uploading image</Text>
          <ActivityIndicator size="large" />
        </Overlay>

        <View style={{ marginTop: 5 }}>
          <Button
            raised
            type="outline"
            icon={{
              name: "search",
              size: 10,
              color: "blue"
            }}
            title="Search Beer..."
            onPress={this.updateSearchState}
          />
          {showSearch ? (
            <BeersList navigation={this.props.navigation} />
          ) : null}
        </View>
        <View style={{ margin: 50, textAlign:'center',alignContent:'center' }}>
          <Text h1 style={{textAlign:'center'}}>Browse Beers</Text>
          <View style={{flexDirection:'row', alignContent:'center', alignSelf:'center'}}>
            <Card  containerStyle={{padding: 0 , width:130,}}>
              <TouchableOpacity  onPress={() =>
                  this.props.navigation.navigate("BeersFound", {
                    value: "Wheat Beer",
                    criteria: "type"
                  })
                }>
              <Image
                style={{height:100,width:130}}
                resizeMode="cover"
                source={require('../../images/wheat-beer.jpg')}
               
              />
              <Text style={{ fontSize: 20, fontWeight: "bold",marginBottom: 10 , textAlign:'center'}}>
Wheat Beer
              </Text>
              </TouchableOpacity>
             
            </Card>
            <Card  containerStyle={{padding: 0, width:130}}>
              <TouchableOpacity  onPress={() =>
                  this.props.navigation.navigate("BeersFound", {
                    value: "Pale lager",
                    criteria: "type"
                  })
                }>
              <Image
                style={{height:100,width:130}}
                resizeMode="cover"
                source={require('../../images/pale-lager.jpg')}
               
              />
              <Text style={{ fontSize: 20, fontWeight: "bold",marginBottom: 10, textAlign:'center' }}>
              Pale Lager
              </Text>
              </TouchableOpacity>
              
            </Card>
          </View>
          <View style={{flexDirection:'row',alignSelf:'center'}}>
            <Card  containerStyle={{padding: 0 , width:130}}>
              <TouchableOpacity  onPress={() =>
                  this.props.navigation.navigate("BeersFound", {
                    value: "Stout",
                    criteria: "type"
                  })
                }>
              <Image
                style={{height:100,width:130}}
                resizeMode="cover"
                source={require('../../images/stout.jpg')}
               
              />
              <Text style={{ fontSize: 20, fontWeight: "bold",marginBottom: 10, textAlign:'center' }}>
Stout
              </Text>
              </TouchableOpacity>
             
            </Card>
            <Card  containerStyle={{padding: 0, width:130}}>
              <TouchableOpacity  onPress={() =>
                  this.props.navigation.navigate("BeersFound", {
                    value: "Dark lager",
                    criteria: "type"
                  })
                }>
              <Image
                style={{height:100,width:130}}
                resizeMode="cover"
                source={require('../../images/dark-lager.jpg')}
               
              />
              <Text style={{ fontSize: 20, fontWeight: "bold"  , textAlign:'center'}}>
              Dark Lager
              </Text>
              </TouchableOpacity>
              
            </Card>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {this.state.visionError && (<Text style={{color:'red',fontSize:20, textAlign:'center',bottom:5,paddingTop:2}}>No beers found</Text>)}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.clickHandler}
            style={styles.TouchableOpacityStyle}
          >
            <Icon
              name="camera"
              size={80}
              color="#f50"
              type="evilicon"
              style={styles.FloatingButtonStyle}
              onPress={this.submitToGoogle}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  TouchableOpacityStyle: {
    bottom: 10
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    borderRadius: 2,
    borderWidth: 0.5,
    marginTop: 20
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1,
    height: Dimensions.get("window").width / 4, // approximate a square
    borderRadius: 4,
    borderWidth: 4,
    margin: 2
  }
});
