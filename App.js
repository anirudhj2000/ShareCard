import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ShareCard from './src/sharecard';
import ShareCardWeb from './src/shareCardWeb';
import { Provider, DefaultTheme } from 'react-native-paper';

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
        <Provider theme={theme}>
          <ShareCard/>
        </Provider>
        :
        <Provider>
          <ShareCardWeb/>
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
