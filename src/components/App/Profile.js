import React, { Component } from 'react'
import { View ,ScrollView} from 'react-native'
import { Icon,Rating, ListItem} from 'react-native-elements'
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'
import algoliasearch from 'algoliasearch'

export default class Profile extends Component {
    state={beers:[]}
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

      

    componentDidMount(){
      const { currentUser } = firebase.auth()

      client = algoliasearch('8V33FGVG49', '7363107e25d7595aa932b9885bb11ef8');

      indexFavorites = client.initIndex('user_favorites')
      indexFavorites.search({
        query: currentUser.uid,
        removeWordsIfNoResults: 'allOptional'
      }).then((hits)=>{
        if(hits.hits){
          this.setState({beers:[...hits.hits]})
        }
        this.props.fetchData();
       })
    }
  render() {
    return (
      <ScrollView>
      { 
          this.state.beers.map((b, i) => (
          <ListItem
              key={i}
              leftAvatar={{ source: { uri: b.beer.img_url } ,size:80}}
              rightIcon={
              <Rating
                type='star'
                ratingCount={5}
                startingValue={b.beer.rating}
                imageSize={25}
                readonly
              />
            }
              title={b.beer.name}
              subtitle={b.beer.type}
              onPress={()=>this.props.navigation.navigate('BeerDetails',{'beer':b.beer})}
          />
          ))
      }
    </ScrollView>
    )
  }
}
