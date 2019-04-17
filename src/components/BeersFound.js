import React from 'react'
import {  View } from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem ,Icon,Divider  } from 'react-native-elements'

export default class BeersFound extends React.Component {
    static navigationOptions = {
        title: 'Beers',
        headerRight:(
          <View style={{margin:10}}>
          <Icon  name='account-circle' onPress={() => firebase.auth()
            .signOut()
            .then(() => this.props.navigation.navigate('Login'))} />
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
    beerType = this.props.navigation.state.params;

    componentDidMount(){
        firebase.firestore().collection('beers').where("type", "==", this.beerType).get().then((querySnapshot)=> {
            temp=[]
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                temp.push(doc.data())
            });
            this.setState({beers:temp})

        }).catch((error)=>alert(error)).then();

        
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
            />
            ))
        }
      </View>
    )
  }
}
