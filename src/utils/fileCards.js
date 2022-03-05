import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,Animated,ToastAndroid,Platform,Linking} from 'react-native';
import { Badge } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const RenderFileModal = (props) =>{
    return(
        <View style={{width:'90%',alignSelf:'center',height:windowHeight*0.05,marginVertical:10,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
            <TouchableOpacity onPress={props.onPress} style={{position:'absolute',left:0,top:0,marginTop:-8,marginLeft:-8}}>
                <Badge size={20} style={{backgroundColor:'#ababab',color:'#c7c7c7',fontSize:16}}>x</Badge>
            </TouchableOpacity>
            <Image source={props.Icon} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
            <Text style={{fontSize:12,marginRight:'5%',fontFamily :'SpaceMono_400Regular'}}>{props.title}</Text>
            <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',height:windowHeight*0.03,width:'15%',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%',borderRadius:4}}>
                <Text style={{fontSize:12,marginRight:'5%',paddingLeft:5,fontFamily :'SpaceMono_400Regular'}}>{props.size}</Text>
                <Text style={{fontSize:12,marginRight:'5%',paddingRight:5,fontFamily :'SpaceMono_400Regular'}}>{props.sizeType}</Text>
            </View>
        </View>
    )
}

export const RenderFile = (props) =>{
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={{width:'90%',alignSelf:'center',height:windowHeight*0.05,marginVertical:5,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
                <Image source={props.Icon} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
                <Text style={{fontSize:12,marginRight:'5%',fontFamily :'SpaceMono_400Regular'}}>{props.title}</Text>
                <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',height:windowHeight*0.03,width:'15%',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%',borderRadius:4}}>
                    <Text style={{fontSize:12,marginRight:'5%',paddingLeft:5,fontFamily :'SpaceMono_400Regular'}}>{props.size}</Text>
                    <Text style={{fontSize:12,marginRight:'5%',paddingRight:5,fontFamily :'SpaceMono_400Regular'}}>{props.sizeType}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// () => {manageFiles(item)}
{/* 1000*100 ? item.size/(1000*1000).toFixed(2) :  item.size/(1000).toFixed(2)} */}