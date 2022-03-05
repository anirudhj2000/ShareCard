import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,Animated,ToastAndroid,Platform,Linking,Button} from 'react-native';
import {useFonts,SpaceMono_400Regular} from '@expo-google-fonts/space-mono';
import { RenderFileModal } from "./utils/fileCards";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Splash = (props) => {
    let [fontsLoaded] = useFonts({
        SpaceMono_400Regular,
      });

    let fadeAnim = new Animated.Value(100);
    let opacity1 = new Animated.Value(0);
    
    const [toggle ,toggleModal] = useState(false);

    const logoAnim = async() => {
        Animated.timing(fadeAnim,{
            toValue:0,
            duration:1000,
            useNativeDriver:false
        }).start()
        setTimeout(() => {toggleModal(true)},2000);
        Animated.timing(opacity1,{
            toValue:1,
            duration:500,
            useNativeDriver:false
        }).start()

    }

    // useEffect(() => {
    //     logoAnim();
    //     fadeAnim = new Animated.Value(0);
    // },[toggle]);

    useEffect(() => {
        console.log("useEff");
        logoAnim();
    });

    

    return(
        <View style={styles.container}>
            
            
            <View style={{height:windowHeight*0.70,width:windowWidth*0.9,alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                <Animated.Image source={require('../assets/logo_3.png')} style={[{marginTop : fadeAnim},{height:windowHeight*0.5,width:windowWidth*0.9}]}/>        
            </View>


          
            <Animated.View style={[{opacity:opacity1},{height:windowHeight*0.3,width:windowWidth,backgroundColor:'#fff',borderRadius:32,borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744'}]}>
                <View style={{width:'90%',marginHorizontal:'5%',marginTop:'10%',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:20,fontFamily:'SpaceMono_400Regular',alignSelf:'center',color:'#87e0b1'}}>Welcome to Share Card!</Text>
                            <TouchableOpacity onPress={() => {props.navigation.navigate('Sharecard')}} style={{alignSelf:'center',justifyContent:'center',alignItems:'center',marginVertical:'5%'}}>
                                <View style={{height:windowHeight*0.05,width:windowWidth*0.7,backgroundColor:'#ababba',borderRadius:8}}>

                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row',width:windowWidth*0.8,marginHorizontal:windowWidth*0.1,justifyContent:'space-around',marginVertical:'2.5%'}}>
                                <TouchableOpacity >
                                    <Text style={{fontSize:14,fontFamily:'SpaceMono_400Regular',marginHorizontal:'2.5%',color:'#87e0b1'}}>Terms of service</Text>
                                </TouchableOpacity>
                                <Text style={{fontSize:14,fontFamily:'SpaceMono_400Regular',color:'#87e0b1'}}>|</Text>
                                <TouchableOpacity>
                                    <Text style={{fontSize:14,fontFamily:'SpaceMono_400Regular',marginHorizontal:'2.5%',color:'#87e0b1'}}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>        
                    <View style={{flexDirection:'row',width:windowWidth*0.6,marginHorizontal:windowWidth*0.2,justifyContent:'center',marginVertical:'2.5%'}}>
                                    <Text style={{fontSize:14,fontFamily:'SpaceMono_400Regular',marginHorizontal:'2.5%',color:'#87e0b1'}}>Crafted with {'<3'} by</Text>
                                    <TouchableOpacity onPress={() => {Linking.openURL('https://github.com/anirudhj2000')}}>
                                        <Text style={{fontSize:14,fontFamily:'SpaceMono_400Regular',marginHorizontal:'2.5%',color:'#87e0b1',textDecorationLine:'underline'}}>Anirudh</Text>
                                    </TouchableOpacity>
                    </View>
                </View>            
            </Animated.View>
           


        </View>
        
    )
}

const styles = StyleSheet.create({
    container : {
        height:'100%',
        width:windowWidth,
        backgroundColor:'#201f3d',
        flex:1,
        marginTop:windowHeight*0.035,
        flexDirection:'column',
        fontFamily :'SpaceMono_400Regular'
    },
})

export default Splash;