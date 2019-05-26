import React, { Component } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {
  Image,
  Text,
  Divider,
  Rating,
  Icon as Ic
} from "react-native-elements";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/AntDesign";
import algoliasearch from "algoliasearch";
import firebase from "react-native-firebase";

export default class BeerDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Details",
    headerRight: (
      <View style={{ margin: 15 }}>
        <Ic
          name="account-circle"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    )
  });

  state = {
    beer: {},
    liked: false,
    ratingDisabled: false,
    likeLoading: true,
    detailsLoading: true,
    myRating:false
  };

  client = algoliasearch("8V33FGVG49", "7363107e25d7595aa932b9885bb11ef8");
  index = this.client.initIndex("beers");
  indexFavorites = this.client.initIndex("user_favorites");
  indexRatings = this.client.initIndex("users_rating");

  componentWillUnmount() {
    this.didFocusListener.remove();
  }

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({currentUser})
    this.didFocusListener = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.setState({
          beer: this.props.navigation.getParam("beer", ""),
          likeLoading: true,
          detailsLoading: true,
          currentUser,
          myRating: 0
        });
        this.indexRatings.search(
          { filters:  '"' +
          this.state.beer.objectID +
          " " +
          this.state.currentUser.uid +
          '"' }).then(
          (hits) => {
            console.log(hits)
            if (hits.hits > 0) {
              this.setState({ myRating: hits[0].rating });
            }
          }
          );

        //did user liked beer if true liked=true

        this.indexFavorites
          .search({
            query: currentUser.uid + " " + this.state.beer.objectID
          })
          .then((hits, { e } = {}) => {
            hits.hits = hits.hits.filter(a => {
              return (
                a._highlightResult.userId.matchedWords.length > 0 &&
                a._highlightResult.beer.objectID.matchedWords.length > 0
              );
            });
            if (hits.hits.length > 0) {
              this.setState({ liked: true });
            } else {
              this.setState({ liked: false });
            }
            this.setState({ likeLoading: false });
          });
      }
    );
  }
  colors = {
    transparent: "transparent",
    white: "#fff",
    heartColor: "#e92f3c",
    textPrimary: "#515151",
    black: "#000"
  };

  ratingCompleted = newRating => {
    //search for older rating
    this.index
      .search({
        filters: '"' +
        this.state.beer.objectID +
        " " +
        this.state.currentUser.uid +
        '"'
      })
      .then(hits => {
        if (hits.hits.length > 0) {
          console.log(hits)
          oldRating = hits.hits[0].rating;
          this.state.beer.rating =
            ((this.state.beer.rating * this.state.beer.rating_count -
            oldRating) +
            newRating) / this.state.beer.rating_count;
          this.index.partialUpdateObject(this.state.beer, (err, content) => {
            this.indexRatings.deleteBy(
              {
                filters:
                  '"' +
                  this.state.beer.objectID +
                  " " +
                  this.state.currentUser.uid +
                  '"'
              },
              res => console.log(res)
            );
            if (this.state.beer._highlightResult)
              delete this.state.beer._highlightResult;
            obj = {
              userId: this.state.currentUser.uid,
              beer: this.state.beer.objectID,
              rating: newRating,
              _tags: this.state.beer.objectID + " " + this.state.currentUser.uid
            };
            this.indexRatings.addObject(obj, (err, content) => {
              console.log(content);
            });
           
          });
        } else {
          //No rating yet
          this.state.beer.rating_count += 1;
          oldRating = this.state.beer.rating;
          this.state.beer.rating =
            (this.state.beer.rating + newRating) / this.state.beer.rating_count;
          this.index.partialUpdateObject(this.state.beer, (err, content) => {
            if (this.state.beer._highlightResult)
              delete this.state.beer._highlightResult;
            obj = {
              userId: this.state.currentUser.uid,
              beer: this.state.beer.objectID,
              rating: newRating,
              _tags: this.state.beer.objectID + " " + this.state.currentUser.uid
            };
            this.indexRatings.addObject(obj, (err, content) => {
              console.log(content);
            });
          });
        }
        this.setState({myRating:false})
      });
  };

  handleOnPressLike = () => {
    this.setState({ liked: !this.state.liked });
    if (this.state.beer._highlightResult)
      delete this.state.beer._highlightResult;
    obj = {
      userId: this.state.currentUser.uid,
      beer: this.state.beer,
      _tags: this.state.beer.objectID + " " + this.state.currentUser.uid
    };
    console.log(this.state.beer.objectID + " " + this.state.currentUser.uid);

    if (!this.state.liked)
      this.indexFavorites.addObject(obj, (err, content) => {
        console.log(content);
      });
    else
      this.indexFavorites.deleteBy(
        {
          filters:
            '"' +
            this.state.beer.objectID +
            " " +
            this.state.currentUser.uid +
            '"'
        },
        res => console.log(res)
      );
  };

  render() {
    AnimatedIcon = Animatable.createAnimatableComponent(Icon);

    return (
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text h2 style={{ textAlign: "center", alignSelf: "center" }}>
            {" "}
            {this.state.beer.name}{" "}
          </Text>
          <ImageBackground
            source={{ uri: this.state.beer.img_url }}
            style={{
              width: 200,
              height: 300,
              justifyContent: "center",
              alignItems: "flex-end",
              borderRadius: 1
            }}
          >
            {this.state.likeLoading && <ActivityIndicator size="large" />}
            {!this.state.likeLoading && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.handleOnPressLike}
                style={{ position: "absolute", bottom: 0 }}
              >
                <AnimatedIcon
                  ref={this.handleSmallAnimatedIconRef}
                  name={this.state.liked ? "heart" : "hearto"}
                  color={
                    this.state.liked
                      ? this.colors.heartColor
                      : this.colors.textPrimary
                  }
                  size={36}
                />
              </TouchableOpacity>
            )}
          </ImageBackground>
          {this.state.myRating===0 &&
          (<Rating
            type="star"
            ratingCount={5}
            startingValue={this.state.myRating}
            imageSize={25}
            showRating
            style={{ paddingVertical: 10 }}
            onFinishRating={this.ratingCompleted}
            defaultRating={0}

          />
          )}
        {this.state.myRating!==0 &&
          (<Rating
            type="star"
            ratingCount={5}
            startingValue={this.state.myRating}
            imageSize={25}
            showRating
            readonly
            style={{ paddingVertical: 10 }}
            onFinishRating={this.ratingCompleted}
            defaultRating={0}

          />
          )}

          <Rating
            type="star"
            ratingCount={5}
            startingValue={this.state.beer.rating}
            imageSize={25}
            showRating
            readonly
            fractions={1}
            style={{ paddingVertical: 10 }}
            defaultRating={0}

          />
        </View>
        <Divider style={{ height: 2, margin: 1 }} />

        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          <Text
            h4
            style={{ textAlign: "center", alignSelf: "center", margin: 1 }}
          >
            {" "}
            Summary{" "}
          </Text>

          <View style={{ margin: 2 }}>
            <Text h5>Avarage Price: {this.state.beer.price}$</Text>
            <Text h5>Type: {this.state.beer.type}</Text>
            <Text h5>Alcohol Precentage: {this.state.beer.alcohol}</Text>
            <Text h5>Origin Country: {this.state.beer.country}</Text>
            <Text h5>Manufacturer: {this.state.beer.manufacturer}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
