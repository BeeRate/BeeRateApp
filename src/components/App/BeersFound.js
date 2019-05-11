import React from 'react'
import {  View ,ScrollView} from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem ,Icon,Divider,Rating  } from 'react-native-elements'
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export default class BeersFound extends React.Component {
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
      <ScrollView>
        {
            this.state.beers.map((b, i) => (
            <ListItem
                key={i}
                leftAvatar={{ source: { uri: b.img_url } ,size:80}}
                rightIcon={<Rating
                  type='star'
                  ratingCount={5}
                  startingValue={b.rating}
                  imageSize={25}
                  readonly
                />}
                title={b.name}
                subtitle={b.type}
                onPress={()=>this.props.navigation.navigate('BeerDetails',{'beer':b})}
            />
            ))
        }
      </ScrollView>
    )
  }
}
