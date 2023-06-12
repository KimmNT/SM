import React, {useEffect, useState} from 'react';
import Splash from './src/screens/Splash';
import HomeScreen from './src/screens/HomeScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Routing from './src/router/Routing';

const App = () => {
  const [isSplash, setIsSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 5000);
  });
  return (
    // <NavigationContainer>
    //   <Stack.Navigator headerMode="none" initialRouteName="Splash">
    //     <Stack.Screen name="Splash" component={Splash} />
    //     <Stack.Screen name="Home" component={Home} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    <SafeAreaProvider>{isSplash ? <Splash /> : <Routing />}</SafeAreaProvider>
  );
};

export default App;
