import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import {
  Icon,
  Rating,
  ListItem,
  Text,
  Divider,
  Avatar,
  Input,
  Button
} from "react-native-elements";
import { LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import algoliasearch from "algoliasearch";

export default class Profile extends Component {
  state = { beers: [], ratingBeers:[] ,editName:false,nickName:'',originName:''};
  static navigationOptions = {
    title: "Profile",
    headerRight: (
      <View style={{ margin: 15 }}>
        <Icon
          name="exit-to-app"
          onPress={() => {
            LoginManager.logOut;
            firebase
              .auth()
              .signOut()
              .then(() => props.navigation.navigate("Login"));
          }}
        />
      </View>
    ),
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "roboto"
    },
    headerVisible: true
  };

  componentWillUnmount() {
    this.didFocusListener.remove();
  }
  client = algoliasearch("8V33FGVG49", "7363107e25d7595aa932b9885bb11ef8");

  componentDidMount() {
    const { currentUser,ratingBeers=[] } = firebase.auth();
    indexFavorites = this.client.initIndex("user_favorites");
    indexRating = this.client.initIndex("users_rating");
    index = this.client.initIndex("beers");
    indexUsers = this.client.initIndex("users");
    indexUsers.search({query:currentUser.uid}).then((hits)=>{
      if(hits.hits.length>0){
        console.log(hits)
        this.setState({nickName:hits.hits[0].name,originName:hits.hits[0].name})
      }else{
        this.setState({nickName:'Beer Lover',originName:hits.hits[0].name})
      }
    }).catch((e)=>console.log(e))
    this.didFocusListener = this.props.navigation.addListener(
      "didFocus",
      () => {
        console.log("favourits refresh");
        indexFavorites
          .search({
            query: currentUser.uid
          })
          .then(hits => {
            if (hits.hits) {
              beersQuery = [];
              hits.hits.forEach(a => beersQuery.push(a.beer));
              index.getObjects(beersQuery).then(beerHits => {
                this.setState({ beers: [...beerHits.results] });
              });
            }
          });

          indexRating.search({query:currentUser.uid}).then((hits)=>{
            beersQuery=[];
            hits.hits.forEach(a => beersQuery.push(a.beer));
            index.getObjects(beersQuery).then(beerHits => {
              tmp=[]
              for(let i=0;i<beerHits.results.length;i++){
                userRating=hits.hits.filter(a=>a.beer==beerHits.results[i].objectID)[0].rating
                tmp.push({
                  beer:beerHits.results[i],
                  rating:userRating
                })
              }
              this.setState({ratingBeers:tmp})
            });         
           })
      }
    );
  }

  updateName=()=>{
    const { currentUser } = firebase.auth();
    indexUsers = this.client.initIndex("users");
    indexUsers.search({query:currentUser}).then(hits=>{
      obj={userId:currentUser.uid, name:this.state.nickName}
      if(hits.hits.length>0){
        indexUsers.add([obj]).then(a=>console.log(a))
      }else{
        indexUsers.partialUpdateObject(obj).then(a=>console.log(a))
      }
      this.setState({editName:false,originName:this.state.nickName})
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={{ alignItems: "center" , marginTop:15}}>
          <Avatar
            rounded
            size="xlarge"
            activeOpacity={0.7}
            source={{
              uri:
                "https://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png"
            }}
            title="dor wiser"
          />
            <View style={{flexDirection:'row'}}>
            {!this.state.editName && (<Text h3>{this.state.originName}</Text>)}
            {this.state.editName && 
            (<Input
          placeholder="NickName"
          autoCapitalize="none"
          onChangeText={nickName => this.setState({ nickName })}
          value={this.state.nickName}/>
          
          )}
       
            <Icon
              name='edit'
              style={{marginLeft:15,top:10,marginRight:10}}
              onPress={()=>this.setState({editName:!this.state.editName})}
            />
            </View>
            {this.state.editName && (<Button  
              title='Submit'
              onPress={()=>this.updateName()}
          />)}
        </View>
        <Divider style={{marginTop:15}} />

        <View style={{marginLeft:10}}>
          <Text h4>Liked Beers </Text>
        </View>

        {this.state.beers.map((b, i) => (
          <ListItem
            key={i}
            leftAvatar={{ source: { uri: b.img_url }, size: 80 }}
            rightIcon={
              <Rating
                type="star"
                ratingCount={5}
                startingValue={b.rating}
                imageSize={25}
                readonly
              />
            }
            title={b.name}
            subtitle={b.type}
            onPress={() =>
              this.props.navigation.navigate("BeerDetails", { beer: b })
            }
          />
        ))}

        <View style={{marginLeft:10,marginTop:20}}>
          <Text h4>Your Ratings </Text>
        </View>
        <Divider />

        {this.state.ratingBeers.map((b, i) => (
          <ListItem
            key={i}
            leftAvatar={{ source: { uri: b.beer.img_url }, size: 80 }}
            rightIcon={
              <Rating
                type="star"
                ratingCount={5}
                startingValue={b.rating}
                imageSize={25}
                readonly
              />
            }
            title={b.beer.name}
            subtitle={b.beer.type}
            onPress={() =>
              this.props.navigation.navigate("BeerDetails", { beer: b.beer })
            }
          />
        ))}
      </ScrollView>
    );
  }
}
