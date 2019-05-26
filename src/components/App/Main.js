import React from 'react'
import { StyleSheet, ScrollView, Dimensions,  View,TouchableOpacity,FlatList,Alert } from 'react-native'
import { Icon,Button,Text,Divider } from 'react-native-elements'
import firebase,{imageRef} from 'react-native-firebase'
import BeersList from './SearchBeerBar'
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid';



export default class Main extends React.Component {
  state = {
    search: '',
     currentUser: null ,
     showSearch:false,
  image: null,
  uploading: false,
  googleResponse: null}

  static navigationOptions =({navigation})=>( {
    title: 'Find Your Beer',
    headerRight:
      
      <View style={{margin:15}}>
      <Icon  name='account-circle' onPress={()=> navigation.navigate("Profile")} />
        </View>
    ,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily:'roboto'
    },
    headerVisible: true,
  });


  //On launching component
  componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA)
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  //   Blob = RNFetchBlob.polyfill.Blob;
  //   fs = RNFetchBlob.fs;
  //  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
  //  window.Blob = Blob;
}

// uploadImage(uri, mime = 'image/jpeg', name) {

//   return new Promise((resolve, reject) => {
//     imgUri = uri; uploadBlob = null;
//     const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
//     const { currentUser } = firebase.auth();
//     const imageRef = firebase.storage().ref(`/jobs/${currentUser.uid}`)

//     fs.readFile(uploadUri, 'base64')
//       .then(data => {
//         return Blob.build(data, { type: `${mime};BASE64` });
//       })
//       .then(blob => {
//         uploadBlob = blob;
//         return imageRef.put(blob, { contentType: mime, name: name });
//       })
//       .then(() => {
//         uploadBlob.close()
//         return imageRef.getDownloadURL();
//       })
//       .then(url => {
//         resolve(url);
//       })
//       .catch(error => {
//         reject(error)
//     })
//   })
// }

submitToGoogle = async () => {  
  try {
    this.setState({ uploading: true });
    // Launch Camera:
      ImagePicker.launchCamera(options, (res) => {
      this.setState({resUri: res.uri })
      body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LOGO_DETECTION", maxResults: 1 },
            ],
            image: {
              source: {
                imageUri: 'https://products1.imgix.drizly.com/ci-heineken-lager-6ea7dedfaaced647.jpeg'
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
      ).then((res)=>{
        // console.log(res.body)
        // this.props.navigation.navigate("BeersFound",{
        //   value:res.responses.logoAnnotations[0].description,
        //   criteria:'name'
        // } ) 
        this.props.navigation.navigate("BeersFound",{
          value:'heineken',
          criteria:'name'
        } ) 
      }).catch((err)=>console.log(err))
      })  
      
     
     
   
      // imguri= this.uploadImage(this.state.resUri,'image/jpeg',response.fileName)

    
   
   } catch (error) {
    console.log(error);
  }
};


  updateSearchState =() =>{
    this.setState({ showSearch:!this.state.showSearch})
  };



render() {
    const { search,currentUser,showSearch } = this.state
    options={
      title: 'Select Avatar',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },};
return (
  <ScrollView style={{ flex: 1 }}>
    <View style={{marginTop:5}}>
    <Button
  raised
  type='outlined'
  icon={{
    name: "search",
    size: 10,
    color: "blue",
  }} title='Search Beer...' onPress={this.updateSearchState}></Button>
  {showSearch ? <BeersList navigation={this.props.navigation}/> : null}

    </View>
  
    <View style={{ margin: 50  }}>
      <Text h1>Browse Beers</Text>
      <View>

      <FlatList 
      data={[
        {value:"Wheat Beer"},{value:'Pale lager'},{value:'Dark lager'},{value:'Stout'}]}
      numColumns={2}
      renderItem={({item}) => 
      <View      style={styles.item}
      >
<TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("BeersFound",{
              value:item.value,
              criteria:'type'
            } )
          }
          style={{color:'transparent',marginBottom:20}}
      >
      <Text style={{fontSize:20,fontWeight:'bold'}}>{item.value}</Text>
      </TouchableOpacity>

      </View>
      }
      >

      </FlatList>
 
      </View>
    </View>
    <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.clickHandler}
          style={styles.TouchableOpacityStyle}
          >
          <Icon
             name='camera'
             size={40}
             color='#f50'
             type='evilicon'
            style={styles.FloatingButtonStyle}
             onPress={this.submitToGoogle}
          />
        </TouchableOpacity>
     
  </ScrollView>
);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 1,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    borderRadius:2,
    borderWidth: 0.5,
    marginTop:20
  },
   item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / 4, // approximate a square
    borderRadius:4,
    borderWidth: 4,
    margin:2
   }
})
