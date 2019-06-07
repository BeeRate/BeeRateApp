import React from 'react'
import {  View ,ScrollView,Text} from 'react-native'
import firebase from 'react-native-firebase'
import { ListItem ,Icon,Overlay,Rating  } from 'react-native-elements'
import algoliasearch from 'algoliasearch'

export default class BeersFound extends React.Component {
  static navigationOptions =({navigation})=>( {
    title: 'Find Your Beer',
    // headerRight:
      
    //   <View style={{margin:15}}>
    //   <Icon  name='account-circle' onPress={()=> navigation.navigate("Profile")} />
    //     </View>
    // ,
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

  
  state = {beer:{},liked:false ,ratingDisabled:false}
  client = algoliasearch('8V33FGVG49', '7363107e25d7595aa932b9885bb11ef8');
  index = this.client.initIndex('beers');
  
    state = {beers: [] }
    beerType = this.props.navigation.getParam('value', '');
    criteria = this.props.navigation.getParam('criteria','');

    componentDidMount(){
        this.setState({loading:true})
       // if(this.criteria=='type'){
         if(this.criteria==='vision'){
          rmWords='allOptional'
          }
           else{
            rmWords='none'
           }
          this.index.search( {query:this.beerType,removeWordsIfNoResults:rmWords}).then( (hits)=>{
            console.log(hits)
            this.setState({beers:[...hits.hits]});
           }).finally(e=>{
            this.setState({loading:false})
           })
    }

  render() {
    return (
      <ScrollView>
        
        {
          this.state.loading? (<Text>Searching...</Text>):
            this.state.beers.length>0 ?
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
            )):
            (<Text>No results found</Text>)
          
         
        }
        
      </ScrollView>
    )
  }
}
