import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ShareCard from "../sharecard";
import Splash from "../splash";

const ShareCardStackNavigator = createStackNavigator();
const ShareCardNavigator = () => {
    return(
    <ShareCardStackNavigator.Navigator>
        <ShareCardStackNavigator.Screen name="Splash" component={Splash} options={{headerShown:false}} />
        <ShareCardStackNavigator.Screen name="Sharecard" component={ShareCard} options={{headerShown:false}} />
    </ShareCardStackNavigator.Navigator>
    )
};




export default () => {

    return (
        <NavigationContainer>
            <ShareCardNavigator/>
        </NavigationContainer>
    );
};