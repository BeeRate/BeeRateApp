import { createSwitchNavigator,createAppContainer,createStackNavigator } from 'react-navigation'

import Loading from './src/components/Loading'
import SignUp from './src/components/SignUp'
import Login from './src/components/Login'
import Main from './src/components/Main'
import BeersFound from './src/components/BeersFound'

const AppNavigator = createStackNavigator({
  Main,
  BeersFound
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
