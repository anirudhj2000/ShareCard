import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,ClipboardStatic,Animated} from 'react-native';
// import Images from "../../Images/Images";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CardHeader = (props) => {

    
    return(
        <View style={{height:windowHeight*0.05,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#87e0b1',borderBottomWidth:1}}>
            <View style={{justifyContent:'center',alignItems:'center',marginHorizontal:'2.5%'}}>
                <TouchableOpacity style={{marginHorizontal:'2.5%'}} onPress={props.onPressEdit}>
                    <Image style={{height:15,width:15,tintColor:'#87e0b1'}} source={require('../../assets/edit.png')} />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-around',width:'20%',marginHorizontal:'5%',alignItems:'center',height:'100%',alignSelf:'flex-end'}}>
                <TouchableOpacity onPress={props.onPressCopy}>
                    <Image style={{height:20,width:20,marginRight:'20%',tintColor:'#87e0b1'}} source={require('../../assets/paste.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onPressShare}>
                    <Image style={{height:20,width:20,marginRight:'20%',tintColor:'#87e0b1'}} source={require('../../assets/send.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CardHeader;