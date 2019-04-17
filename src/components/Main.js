import React from 'react'
import { StyleSheet, Platform, Image,  View,Header } from 'react-native'
import { Icon,SearchBar,Button,Text,Divider } from 'react-native-elements'

import firebase from 'react-native-firebase'
import MainSearchBar from './SearchBar'



export default class Main extends React.Component {
  state = {search: '', currentUser: null }

  static navigationOptions = {
    title: 'Find Your Beer',
    headerRight:(
      <Icon name='account-circle' onPress={() => firebase.auth()
        .signOut()
        .then(() => this.props.navigation.navigate('Login'))} />
    ),
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerVisible: true,
  };
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



render() {
    const { search,currentUser } = this.state

return (
  <View style={{flex:1}}>
        <View>
        <SearchBar
        placeholder="Search Beer"
        onChangeText={this.updateSearch}
        value={search}
        platform='android'
      />
        </View>
  <View style={{margin:50}}>
  <Text h1>Browse Beers</Text>
  <Divider style={{ backgroundColor: 'blue' }} />
<View style={{margin:30}}>
<Button style={{width:500,    borderRadius: 10,}} title='Pale lager'></Button>
</View >
<View style={{margin:30}}>
<Button style={{width:70,margin:20}} title='Dark lager'></Button>
</View>
<View style={{margin:30}}>
<Button style={{width:70,margin:20}} title='Wheat Beer'></Button>
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
  }
})