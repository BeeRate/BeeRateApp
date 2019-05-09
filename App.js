import { createSwitchNavigator,createAppContainer,createStackNavigator } from 'react-navigation'

import Loading from './src/components/Authentication/Loading'
import SignUp from './src/components/Authentication/SignUp'
import Login from './src/components/Authentication/Login'
import Main from './src/components/App/Main'
import BeersFound from './src/components/App/BeersFound'

const AppNavigator = createStackNavigator({
  Main,
  BeersFound,
  Profile,
  BeerDetails
},
{
  headerLayoutPreset: 'center' // default is 'left'
})


const AuthNavigator = createSwitchNavigator(
  {
    SignUp,
    Login,
  },
  {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
  }
)

export default createAppContainer(createSwitchNavigator(
  {
    Loading:Loading,
    Auth:AuthNavigator,
    App:AppNavigator
  },{
    initialRouteName: 'Loading'
  }));
