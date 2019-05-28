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
import { Icon, Button, Text, Overlay } from "react-native-elements";
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
    googleResponse: null
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

  //On launching component
  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
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
      console.log(imageRef);
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
        });
    });
  }

  submitToGoogle = () => {
    try {
      // Launch Camera:
      ImagePicker.launchCamera(options, res => {
        this.setState({ resUri: res.uri });
        console.log(res);
        this.setState({ uploading: true });

        this.uploadImage(res.path).then(fbres => {
          console.log(fbres);
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
          console.log(body);

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
          )
            .then(res => {
              // console.log(res.body)
              // this.props.navigation.navigate("BeersFound",{
              //   value:res.responses.logoAnnotations[0].description,
              //   criteria:'name'
              // } )
              console.log(res);
              try {
                res.json().then(json => {
                  console.log(json);
                  if (json.responses.length > 0) {
                    beerName = json.responses[0].logoAnnotations[0].description;
                    console.log(beerName);
                    this.props.navigation.navigate("BeersFound", {
                      value: beerName,
                      criteria: "vision"
                    });
                  }
                  this.setState({ uploading: false });

                });
              } catch (e) {
                console.log(e);
                this.setState({ uploading: false });

              }
            })
            .catch(err => {console.log(err);       this.setState({ uploading: false });
          });
        });

      });

      // imguri= this.uploadImage(this.state.resUri,'image/jpeg',response.fileName)
    } catch (error) {
      this.setState({ uploading: false });
    }
  };

  updateSearchState = () => {
    this.setState({ showSearch: !this.state.showSearch });
  };

  render() {
    const { search, currentUser, showSearch } = this.state;
    data = [
      { value: "Wheat Beer", path: "../../images/wheatBeer.jpg" },
      { value: "Pale lager", path: "../../images/paleLager.jpg" },
      { value: "Dark lager", path: "../../images/darkLager.jpg" },
      { value: "Stout", path: "../../images/stout.jpg" }
    ];
    options = {
      title: "Select Avatar",
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
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
          {showSearch ? <BeersList navigation={this.props.navigation} /> : null}
        </View>
        <View style={{ margin: 50 }}>
          <Text h1>Browse Beers</Text>
          <View>
            <FlatList
              data={[
                { value: "Wheat Beer" },
                { value: "Pale lager" },
                { value: "Dark lager" },
                { value: "Stout" }
              ]}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("BeersFound", {
                        value: item.value,
                        criteria: "type"
                      })
                    }
                    style={{ color: "transparent", marginBottom: 20 }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
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
    bottom: 1
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
