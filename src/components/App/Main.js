import React from 'react'
import { StyleSheet, Platform, Image,  View,Header } from 'react-native'
import { Icon,SearchBar,Button,Text,Divider } from 'react-native-elements'
import firebase from 'react-native-firebase'


export default class Main extends React.Component {
  state = {search: '', currentUser: null }

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


  updateSearch = search => {
    this.setState({ search });
  };

render() {
    const { search,currentUser } = this.state

return (
  <View style={{ flex: 1 }}>
    <View>
      <SearchBar
        placeholder="Search Beer"
        onChangeText={this.updateSearch}
        value={search}
        platform="android"
      />
    </View>
    <View style={{margin: 30}}>
      <Button title="Search" onPress={()=>this.props.navigation.navigate("BeersFound", {
              value:this.state.search,
              criteria:'name'
            }
            )}></Button>

    </View>
    <View style={{ margin: 50 }}>
      <Text h1>Browse Beers</Text>
      <Divider style={{ backgroundColor: "blue" }} />
      <View style={{ margin: 30 }}>
        <Button
          onPress={() =>
            this.props.navigation.navigate("BeersFound", {
              value:'Pale lager',
              criteria:'type'
            }
            )
          }
          title="Pale lager"
        />
      </View>
      <View style={{ margin: 30 }}>
        <Button
          style={{ width: 70, margin: 20 }}
          onPress={() =>
            this.props.navigation.navigate("BeersFound",{
              value:"Dark lager",
              criteria:'type'
            } )
          }
          title="Dark lager"
        />
      </View>
      <View style={{ margin: 30 }}>
        <Button
          onPress={() =>
            this.props.navigation.navigate("BeersFound",{
              value:"Wheat Beer",
              criteria:'type'
            }  )
          }
          title="Wheat Beer"
        />
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
