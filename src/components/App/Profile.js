import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import {
  Icon,
  Rating,
  ListItem,
  Text,
  Divider,
  Avatar,
  Overlay
} from "react-native-elements";
import { LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import algoliasearch from "algoliasearch";

export default class Profile extends Component {
  state = { beers: [], ratingBeers:[] };
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

  componentDidMount() {
    const { currentUser,ratingBeers=[] } = firebase.auth();
    client = algoliasearch("8V33FGVG49", "7363107e25d7595aa932b9885bb11ef8");
    indexFavorites = client.initIndex("user_favorites");
    indexRating = client.initIndex("users_rating");
    index = client.initIndex("beers");

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
                "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
            }}
            title="dor wiser"
          />
          <Text h3>Bee Rate</Text>
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
