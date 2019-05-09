import React from 'react'
import {  View } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem ,Icon,Divider  } from 'react-native-elements'
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export default class BeersFound extends React.Component {
    static navigationOptions = {
        title: 'Beers',
        headerRight:(
          <View style={{margin:10}}>
          <Icon  name='account-circle' onPress={() => {
            LoginManager.logOut;
            firebase.auth()
            .signOut()
            .then(() => this.props.navigation.navigate('Login'))}} />
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

    state = {beers: [] }
    beerType = this.props.navigation.getParam('value', '');
    criteria = this.props.navigation.getParam('criteria','');

    componentDidMount(){
        if(this.criteria=='type'){
            firebase.firestore().collection('beers').where("type", "==", this.beerType).get().then((querySnapshot)=> {
                temp=[]
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    temp.push(doc.data())
                });
                this.setState({beers:temp})
    
            }).catch((error)=>alert(error)).then();
        }
        else if(this.criteria=='name'){
            firebase.firestore().collection('beers').where('name', '>=', this.beerType).where('name', '<=', this.beerType).get().then((querySnapshot)=> {
                temp=[]
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    temp.push(doc.id,...doc.data())
                });
                this.setState({beers:temp})
    
            }).catch((error)=>alert(error)).then();
        }
         
    }

  render() {
    return (
      <View>
        {
            this.state.beers.map((b, i) => (
            <ListItem
                key={i}
                leftAvatar={{ source: { uri: b.img_url } }}
                title={b.name}
                subtitle={b.type +" "+b.rating}
                onPress={()=>this.props.navigation.navigate('BeerDetails',b)}
            />
            ))
        }
      </View>
    )
  }
}
