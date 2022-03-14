import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ShareCard from './src/sharecard';
import ShareCardWeb from './src/shareCardWeb';
import Splash from './src/splash';
import { Provider, DefaultTheme } from 'react-native-paper';
import {useFonts,SpaceMono_400Regular} from '@expo-google-fonts/space-mono';
import Navigation from './src/utils/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};


export default function App() {

  const getUser = async() => {
    let user = await AsyncStorage.getItem('User');

    return user;
  }

  return (
     Platform.OS === 'android'?
        <Provider  theme={theme}>
          {getUser() ? <Navigation/> : <ShareCard/>}
        </Provider>
        :
        null
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
