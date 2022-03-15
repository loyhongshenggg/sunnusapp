import { useEffect, useState } from 'react'

/* firebase */
import { onAuthStateChanged } from 'firebase/auth'

/* navigation */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

/* sunnus components */
import { auth } from '@/sunnus/firebase'

/* screens */
import Login from '@/screens/LoginScreen'
import HomeScreen from '@/screens/HomeScreen'

import { UserState } from '@/types/index'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const Home = () => (
  <Drawer.Navigator
    initialRouteName="HomeScreen"
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="HomeScreen" component={HomeScreen} />
  </Drawer.Navigator>
)

/*
 * uses a react state to keep track of whether the user is logged in or not.
 * this prevent the accidental navigation to a screen that a particular user
 * group is not supposed to see.
 */
const AuthNavigation = () => {
  /* initialize user's state */
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    isRegistered: false,
  })

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      /*
       * on a failed firebase login, user will be null
       * so it suffices to check the truthiness of user to determine a
       * successful login.
       */
      if (user) {
        setUserState({ isLoggedIn: true, isRegistered: true })
      } else {
        setUserState({ isLoggedIn: false, isRegistered: false })
      }
    })
  }, [])

  const handleLoginState = (userState: UserState) => {
    const minOpts = {
      headerBackVisible: false,
      headerShown: false,
    }

    if (userState.isLoggedIn) {
      if (userState.isRegistered) {
        /* user has logged in with firebase */
        return <Stack.Screen name="Home" component={Home} options={minOpts} />
      } else {
        /* user has logged in as guest (no firebase) */
        return <Stack.Screen name="Home" component={Home} options={minOpts} />
        // TODO: handle guest option properly
        // (currently treat guests as registered users)
      }
    } else {
      /* user has yet to log in at all */
      return <Stack.Screen name="Login" component={Login} options={minOpts} />
    }
  }

  return <Stack.Navigator>{handleLoginState(userState)}</Stack.Navigator>
}

export default AuthNavigation