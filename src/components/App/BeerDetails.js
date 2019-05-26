import React, { Component } from 'react'
import {  View,ScrollView,ImageBackground,TouchableOpacity} from 'react-native'
import { Image,Text,Divider,Rating,Icon as Ic } from 'react-native-elements';
import * as Animatable from 'react-native-animatable' 
import Icon from 'react-native-vector-icons/AntDesign'
import algoliasearch from 'algoliasearch'
import firebase from 'react-native-firebase'

export default class BeerDetails extends Component {
    static navigationOptions = ({navigation})=>( {
          title: "Details",
          headerRight:
      
          <View style={{margin:15}}>
          <Ic  name='account-circle' onPress={()=> navigation.navigate("Profile")} />
            </View>
      });

    state = {beer:{},liked:false ,ratingDisabled:false}
    client = algoliasearch('8V33FGVG49', '7363107e25d7595aa932b9885bb11ef8');
    index = this.client.initIndex('beers');
    indexFavorites = this.client.initIndex('user_favorites');
    indexRatings = this.client.initIndex('users_rating');


    componentDidMount(){
      const { currentUser } = firebase.auth()
      this.setState({ currentUser })
        this.setState({beer:this.props.navigation.getParam('beer','')});
        this.indexRatings.search({query:currentUser+' '+this.state.beer},
        (err, { hits } = {}) => {
          if (err) throw err;
        
          if(hits.length>0){
            this.setState({ratingDisabled:true});
          }
        })

        //did user liked beer if true liked=true
        this.indexFavorites.search({
          query: currentUser.uid,
          removeWordsIfNoResults: 'allOptional'
        }).then((hits, { e } = {})=>{
          console.log(hits.hits)
          console.log(hits.hits[0].beer)
          if(hits.hits.length>0){
            this.setState({liked:true})
          }
          console.log(this.state.beers)
         })
    }
    colors = {
      transparent: 'transparent',
      white: '#fff',
      heartColor: '#e92f3c',
      textPrimary: '#515151',
      black: '#000', 
    }

    ratingCompleted=(newRating)=>{
      this.state.beer.rating_count+=1;
      oldRating=this.state.beer.rating;
      this.state.beer.rating = (this.state.beer.rating + newRating)/this.state.beer.rating_count;
      this.index.partialUpdateObject(this.state.beer, (err, content)=>{  console.log(content);
      obj={
          userId:this.state.currentUser.uid,
          beer:this.state.beer
        }
      this.indexRatings.addObject(obj, (err, content)=>{console.log(content)})

      })
    }

    handleOnPressLike=()=>{
      this.setState({liked:!this.state.liked})
      obj={
        userId:this.state.currentUser.uid,
        beer:this.state.beer
      }
      if(!this.state.liked)
        this.indexFavorites.addObject(obj, (err, content)=>{console.log(content)});
      else
        this.indexFavorites.deleteByQuery({query:obj.userId+' '+obj.beer.objectId})
    }
    
  render() {
    AnimatedIcon = Animatable.createAnimatableComponent(Icon)

    return (
      <ScrollView >
        <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text h2 style={{textAlign:'center', alignSelf:'center'}}> {this.state.beer.name} </Text>
        <ImageBackground
            source={{ uri: this.state.beer.img_url }}
            style={{ width: 200, height: 300,justifyContent: 'center',
            alignItems: 'flex-end' , borderRadius:1}}            >

<TouchableOpacity
            activeOpacity={1}
            onPress={this.handleOnPressLike}
            style = {{position: 'absolute',
            bottom:0}}
          >
            <AnimatedIcon
              ref={this.handleSmallAnimatedIconRef}
              name={this.state.liked ? 'heart' : 'hearto'}
              color={this.state.liked ? this.colors.heartColor : this.colors.textPrimary}
              size={18}
            />
          </TouchableOpacity>
              
        </ImageBackground>
            <Rating
                  type='star'
                  ratingCount={5}
                  startingValue={this.state.beer.rating}
                  imageSize={25}
                  showRating
                  readonly={false}
                  fractions={1}
                  style={{ paddingVertical: 10 }}
                  onFinishRating={this.ratingCompleted}
                />

        </View>
        <Divider style={{height:2 , margin:1}}></Divider>

      <View style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
              <Text h4 style={{textAlign:'center', alignSelf:'center' ,margin:1}}> Summary </Text>

          <View style={{margin:2}}>
              
          <Text h5>Avarage Price: {this.state.beer.price}$</Text>
          <Text h5>Type: {this.state.beer.type}</Text>
          <Text h5>Alcohol Precentage: {this.state.beer.alcohol}</Text>
          <Text h5>Origin Country: {this.state.beer.country}</Text>
          <Text h5>Manufacturer: {this.state.beer.manufacturer}</Text>

          </View>


      </View>
      </ScrollView>

    )
  }
}
