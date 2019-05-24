import React, { Component } from "react";
import { View, TextInput, StyleSheet, FlatList,Button } from "react-native";
import {ListItem,Rating} from "react-native-elements"
import { InstantSearch } from "react-instantsearch-native";
import {
  connectSearchBox,
  connectInfiniteHits
} from "react-instantsearch/connectors";
import PropTypes from "prop-types";



export default class BeersList extends Component {
  render() {
    return (
      <View>
        <InstantSearch
          appId="8V33FGVG49"
          apiKey="882b3d90514273983b32fc941f6a593f"
          indexName="beers"
        >
          <View>
            <ConnectedSearchBar />
          </View>
          <Hits navigation={this.props.navigation}/>
        </InstantSearch>
      </View>
    );
  }
}
class SearchBar extends Component {
  _textInput: TextInput;
state: State = {
    isFocused: false
  };
render() {
    const { isFocused } = this.state;
return (

      <TextInput
        returnKeyType="done"
        autoFocus
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onChangeText={text => this.props.refine(text)}
        value={this.props.currentRefinement}
        underlineColorAndroid="transparent"
        autoCorrect={true}
      />
    );
  }
focus() {
    this._textInput && this._textInput.focus();
  }
blur() {
    this._textInput && this._textInput.blur();
  }
_onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus && this.props.onFocus();
  };
_onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur();
  };
}
const ConnectedSearchBar = connectSearchBox(SearchBar);

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: "center",
      flexDirection: "column",
    },
    searchContainer: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgb(200, 199, 204)",
      flexDirection: "row",
      alignItems: "center"
    },
    logo: {
      height: 20,
      width: 20
    },
    textInput: {
      height: 20,
      fontSize: 24,
    }
  });

  const Hits = connectInfiniteHits(({ hits, hasMore, refine, navigation }) => {
    /* if there are still results, you can
    call the refine function to load more */
    const { navigate } = navigation
  
  
    const onEndReached = function() {
      if (hasMore) {
        refine();
      }
    };
  
    return (
        <FlatList
          data={hits}
          onEndReached={onEndReached}
          keyExtractor={(item, index) => item.objectID}
          renderItem={({ item }) => {
            return (
                <ListItem 
                key={item.objectID}
                leftAvatar={{ source: { uri: item.img_url }}}
                title={item.name}
                subtitle={item.type}
                onPress={()=>navigation.navigate('BeerDetails',{'beer':item})}
                />
            );
          }}
        />
    );
  });
  

