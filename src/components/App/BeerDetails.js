import React, { Component } from 'react'
import {  View,ScrollView } from 'react-native'
import { Image,Text,Divider,Rating,Icon } from 'react-native-elements';

export default class BeerDetails extends Component {
    static navigationOptions = ({navigation})=>( {
          title: "Details",
          headerRight:
      
          <View style={{margin:15}}>
          <Icon  name='account-circle' onPress={()=> navigation.navigate("Profile")} />
            </View>
      });

    state = {beer:{} }

    componentDidMount(){
        this.setState({beer:this.props.navigation.getParam('beer','')});
    }

  render() {

    return (
      <ScrollView >
        <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text h2 style={{textAlign:'center', alignSelf:'center'}}> {this.state.beer.name} </Text>
        <Image
            source={{ uri: this.state.beer.img_url }}
            style={{ width: 200, height: 300,justifyContent: 'center',
            alignItems: 'center' , borderRadius:1}}            />
            <Rating
                  type='star'
                  ratingCount={5}
                  startingValue={this.state.beer.rating}
                  imageSize={25}
                  showRating
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
      <Divider style={{height:2 , margin:1}}></Divider>

      <View style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
              <Text h4 style={{textAlign:'center', alignSelf:'center' ,margin:1}}> Reviews </Text>

      </View>
      </ScrollView>

    )
  }
}
