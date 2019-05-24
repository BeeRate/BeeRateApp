import React from 'react'
import { StyleSheet, Platform, Image,  View,Header,FlatList } from 'react-native'
import { Icon,Button,Text,Divider } from 'react-native-elements'
import firebase from 'react-native-firebase'
import BeersList from './SearchBeerBar'

export default class Main extends React.Component {
  state = {search: '', currentUser: null ,showSearch:false}

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
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
}


handleLogout=()=> {
  currentUser.auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Login'))
    .catch(error => alert(error.message) )
  }


  updateSearchState =() =>{
    this.setState({ showSearch:!this.state.showSearch})
  };



render() {
    const { search,currentUser,showSearch } = this.state

return (
  <View style={{ flex: 1 }}>
    <View style={{marginTop:10}}>
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
  
     

    <View style={{margin: 30}}>

    </View>
    <View style={{ margin: 50  }}>
      <Text h1>Browse Beers</Text>
      <Divider style={{ backgroundColor: "blue" }} />
      <View style={{ margin: 30,flexDirection:'row' ,aspectRatio: 1, alignItems:'center'}}>

      <FlatList 
      data={[
        {value:"Wheat Beer"},{value:'Pale lager'},{value:'Dark lager'},{value:'Pale lager'}]}
      numColumns={2}
      renderItem={({item}) => 
      <Button
      style={{ width: 70,height:70, margin: 20 }}
          onPress={() =>
            this.props.navigation.navigate("BeersFound",{
              value:item.value,
              criteria:'type'
            } )
          }
          title={item.value}
      >

      </Button>}
      >

      </FlatList>
        
      </View>
      
     
    </View>
  </View>
);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
