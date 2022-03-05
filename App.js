import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ShareCard from './src/sharecard';
import ShareCardWeb from './src/shareCardWeb';
import Splash from './src/splash';
import { Provider, DefaultTheme } from 'react-native-paper';
import {useFonts,SpaceMono_400Regular} from '@expo-google-fonts/space-mono';
import Navigation from './src/utils/Navigation';

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
  return (
     Platform.OS === 'android'?
        <Provider  theme={theme}>
          <Navigation/>
        </Provider>
        :
        <Provider>
          <ShareCard/>
        </Provider>
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
