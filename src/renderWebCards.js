import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,ClipboardStatic,Animated} from 'react-native';

const RenderCards = (props) => {
    return(
        <Animated.View style={[{marginTop:slideUpAnim},{width:windowWidth*0.3,alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744',marginBottom:'5%'}]}>
        <View style={{height:windowHeight*0.05,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#87e0b1',borderBottomWidth:1}}>
            <View style={{justifyContent:'center',alignItems:'center',marginHorizontal:'2.5%'}}>
                <TouchableOpacity>
                    <Image style={{height:20,width:20,marginRight:'7.5%',tintColor:'#87e0b1'}} source={require('../assets/options.png')} />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',width:'30%',alignItems:'center',height:'100%',alignSelf:'flex-end'}}>
                <TouchableOpacity>
                    <Image style={{height:20,width:20,marginRight:'20%',tintColor:'#87e0b1'}} source={require('../assets/paste.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {handleShare(item.title,item.content)}}>
                    <Image style={{height:20,width:20,marginRight:'20%',tintColor:'#87e0b1'}} source={require('../assets/send.png')} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={{width:'90%',flexDirection:'column',alignSelf:'center',marginBottom:'5%'}}>
            <Text style={{fontSize:24,color:'#87e0b1',marginVertical:'2.5%'}}>{item.title}</Text>
            <Text style={{fontSize:16,color:'#87e0b1',marginVertical:'2.5%'}}>{item.content}</Text>
        </View>
        </Animated.View>
    )
}

export default RenderCards;