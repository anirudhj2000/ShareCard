import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,Animated,ToastAndroid,Platform,Linking,BackHandler} from 'react-native';
import cardContent from "./cardContent";
import CardHeader from "./utils/cardHeader";
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import { Badge } from 'react-native-paper';
import {GetCards,CreateCard,CreateMediaCard,DeleteCard,UploadFile, UpdateCard} from "./utils/api";
import { RenderFileModal,RenderFile } from "./utils/fileCards";
import {useFonts,SpaceMono_400Regular} from '@expo-google-fonts/space-mono';
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShareCard = () => {

    const [toggle, setToggle] = useState(false);
    const [selected, setSelected] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [xCardContent, setCardContent] = useState(cardContent.map((a) => {return {...a}}));
    const [xCard, setCards] = useState([]);
    const [id, setId] = useState("");
    const [editMode,setEditMode] = useState(false);
    const [file,setFile] = useState([]);
    const [menuToggle, setMenuToggle] = useState(false);
    let [fontsLoaded] = useFonts({
        SpaceMono_400Regular,
      });

    const closeMenu = () => setMenuToggle(false);
    const openMenu = () => setMenuToggle(true);

    let slideUpAnimUpload = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(20)).current;

    function handleBackButtonClick() {
        BackHandler.exitApp();
        return true;
      }
    
      useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
      }, []);

    const getIcon = (type) => {
        console.log(type);
        if(type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return require('../assets/doc.png');
        else if(type == 'application/pdf') return require('../assets/pdf.png');
        else if(type == 'image/jpeg' || type == 'image/png') return require('../assets/image-file.png');
        else return require('../assets/txt-file.png');
    }

    const selectFile = async() => {
        try{
            let res = await DocumentPicker.getDocumentAsync({type:"*/*"});
            console.log(res,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            if(res.type == "success"){
                uploadAnim();
                console.log("bc",res);
                let { name, size, uri } = res;
                let nameParts = name.split('.');
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                    name: name,
                    size: size,
                    uri: uri,
                    type: res.mimeType,
                };
                console.log(fileToUpload, '...............file')
                setFile(file.concat(fileToUpload));
            }
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    const copyToClipboard = (content) => {
        Clipboard.setString(JSON.stringify(content));
        if (Platform.OS === 'android') {
            ToastAndroid.show("Copied!", ToastAndroid.SHORT)
        }
      };

    const RenderFiles = () =>{
        console.log("Renderfiles", file);
        return(
            <>
                {file.map((item) => {
                    return(
                    <RenderFileModal onPress={() => {manageFiles(item)}}
                    title = {item.name ? item.name.slice(0,15) + "..." : ""}
                    Icon = {getIcon(item.type)}
                    size = {item.size > 1000*100 ? (item.size/(1000*1000)).toFixed(1) :  (item.size/(1000)).toFixed(1)}
                    sizeType = {item.size > 1000*100 ? "MB":"KB"}
                    />)
                })
                }
            </>
        )
    }

    const manageFiles = (obj) => {
        var i=0;
        var xUploadfile = [...file];
        console.log('lllllll', xUploadfile);
        for(var i=0;i<xUploadfile.length;i++){
            if(xUploadfile[i].name == obj.name){
                break;
            }
            i++;
        }

        xUploadfile.splice(i,1);
        setFile(xUploadfile);
        console.log('uploadedFile',file);
    }

    const handleNewEntry = () => {
        if(editMode){
            updateCard();
        }
        else{
            if(selected){
                AddNewCardMedia();
            }
            else addNewCard();
            resetContent();
            setToggle(!toggle);
        }
    }


    const AddNewCardMedia = async() => {

        let res = await UploadFile(file);
        console.log("lundfiles",res);
        const media = []
        for(var i=0;i<res.length;i++){
            media.push({
                name : file[i].name,
                url : res[i].Location,
                size : file[i].size,
            })
        }
        console.log("post data sheet",media)

        const mediaBody = {
            firstName:"Anirudh",
            title : title,
            media : media,
            content : 'Files',
            contentType :"media",
            dateCreated : Date.now(),
        
        }

        let res1 = await CreateMediaCard(mediaBody);
        console.log(res1);
        getCards();


    }
    const updateCard = async() => {
        
        console.log("update",id)
        const body = {
            firstName:"Anirudh",
            title : title,
            content : content,
            contentType :"media",
            media : file,
            lastModified : Date.now(),
            uses : 1,
        }
        let res = await UpdateCard(body,id)
        getCards();
        setToggle(false);
        resetContent("");
    }

    const getCards = async() => {
        console.log("Hi");
        let res = await GetCards();
        // console.log(res);
        setCards(res);
    }

    const addNewCard = async() => {
        const user  =  await AsyncStorage.getItem('User');
        const body = {
            firstName:"Anirudh",
            title : title,
            content : content,
            contentType :"text",
            dateCreated : Date.now(),
            user : user, 
        }
        let res = await CreateCard(body);
        console.log("res1",res);
        getCards();
      
    }

    const deleteCard = async() => {
        let res = await DeleteCard(id);
        getCards();
        setToggle(!toggle);
        
    }


    const initialAnim = () => {
        Animated.timing(fadeAnim,{
            toValue:1,
            duration:1000,
            useNativeDriver:true
        }).start();
    }

    const cardAnim = () => {
        Animated.timing(slideUpAnim,{
            toValue:0,
            duration:1000,
            useNativeDriver:false
        }).start();
    }

    const uploadAnim = () => {
        Animated.timing(slideUpAnimUpload,{
            toValue:0,
            duration:500,
            useNativeDriver:true,
        }).start();
    }

    const uploadAnimBack = () => {
        Animated.timing(slideUpAnimUpload,{
            toValue:1,
            duration:500,
            useNativeDriver:true,
        }).start();
    }
    

    const handleShare = async(title,content) => {
        try{
            const result = await Share.share({
                message : 
                `${content}`
            });

            if(result.action === Share.sharedAction){
                if (result.activityType) {
                    // shared with activity type of result.activityType
                  } else {
                    // shared
                  }
                } else if (result.action === Share.dismissedAction) {
                  // dismissed
                }
        }
        catch(error){
            console.log(error.message);
        }
    }

    const handleEdit = (item) => {
        setContent(item.content);
        setTitle(item.title);
        setId(item._id);
        setEditMode(true);
        setToggle(true);
        setFile(item.media);
    }

    const resetContent = () => {
        setTitle("");
        setContent("");
        setFile([]);
        uploadAnimBack()
    }

    const handleSelected = (key) => {
        setSelected(key);
    }

   

    const addNewCardModal = () => {
        setContent("");
        setTitle("");
        setEditMode(false);
        setToggle(!toggle);
    }

    const RenderCards = () => {
        cardAnim();
        return(
            <>
                {xCard.map((item) => {

                    return(
                    <Animated.View style={[{marginTop:slideUpAnim},{width:windowWidth*0.8,alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744',marginBottom:'5%'}]}>
                        <CardHeader onPressCopy={() => {copyToClipboard(item.content)}} onPressEdit={() => {handleEdit(item)}} onPressShare={() => {handleShare(item.title,item.content)}}/>
                        <View style={{width:'90%',flexDirection:'column',alignSelf:'center',marginBottom:'5%'}}>
                            <Text style={{fontSize:24,color:'#87e0b1',marginVertical:'2.5%',fontFamily :'SpaceMono_400Regular'}}>{item.title}</Text>
                            <Text style={{fontSize:16,color:'#87e0b1',marginVertical:'2.5%',fontFamily :'SpaceMono_400Regular'}}>{item.content}</Text>
                            {
                                item.contentType == 'media' ? 
                                    <>                                        
                                        {
                                            item.media.map((item1) => {
                                                return(
                                                    <RenderFile 
                                                        onPress={() => {Linking.openURL(item1.url)}}
                                                        title = {item1.name.slice(0,15) + "..."}
                                                        Icon = {getIcon(item1.type)}
                                                        size = {item1.size > 1000*100 ? (item1.size/(1000*1000)).toFixed(1) :  (item1.size/(1000)).toFixed(1)}
                                                        sizeType = {item1.size > 1000*100 ? "MB":"KB"}
                                                    />
                                                )
                                            })
                                        }
                                    </>
                                    
                                :null
                            }
                        </View>
                    </Animated.View>
                    )
                    })   
                }
            </>
        )
    }

    useEffect(() => {
        RenderCards();
    },[xCard])

    useEffect(() => {
        initialAnim();
        getCards();
        console.log("odaodu")
    },[])

    useEffect(() => {
        RenderFiles();
    },[file]);

    return(
        <SafeAreaView style={styles.container}>
                <Animated.View style={[{opacity:fadeAnim},{height:windowHeight*0.1,width:'auto',alignSelf:'flex-start',alignItems:'flex-end',flexDirection:'column',marginHorizontal:windowWidth*0.1,marginVertical:'5%'}]}>
                    <Text style={{fontFamily:'sans-serif-medium',fontSize:32,color:'#87e0b1',marginBottom:-10,marginRight:'5%'}}>Share</Text>
                    <Text style={{fontFamily:'sans-serif-medium',fontSize:32,color:'#deffed',marginBottom:10,marginRight:'5%'}}>Card</Text>
                </Animated.View>

                

                <TouchableOpacity onPress={() => {addNewCardModal()}}>
                <View style={{height:windowHeight*0.05,width:windowWidth*0.8,alignSelf:'center',justifyContent:'center',alignItems:'center',borderRadius:windowHeight*0.05,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744'}}>
                    <Text style={{fontSize:18,color:'#87e0b1',fontFamily :'SpaceMono_400Regular'}}>Add New</Text>
                </View>
                </TouchableOpacity>

                <ScrollView style={{height:windowHeight,marginTop:'7.5%'}}>
                    {xCard.length>0 ?
                        <RenderCards/>:
                        <View style={{justifyContent:'center',alignItems:'center',flexDirection:'column',alignSelf:'center'}}>
                            <Text style={{fontSize:18,color:'#87e0b1',fontFamily :'SpaceMono_400Regular'}}>No Cards!</Text>
                            <Text style={{fontSize:18,color:'#87e0b1',fontFamily :'SpaceMono_400Regular'}}>Add a new card</Text>
                        </View>
                    }
                </ScrollView>


                

                <Modal transparent={true} visible={toggle} animationType="slide">
                    <View style={styles.ModalBackground} >
                        <View style={{height:windowHeight*0.6,width:'90%',alignSelf:'center',backgroundColor:'#fff',borderRadius:8,marginTop:'5%',borderWidth:3,borderColor:'#89c9b6'}}>
                            <View style={{height:windowHeight*0.05,width:'90%',alignSelf:'center',flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'2.5%'}}>
                                <Text style={{fontFamily :'SpaceMono_400Regular', fontSize:24, color:'#34ba92'}}>New Card</Text>
                                <View style={{width:'40%',height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TouchableOpacity onPress={() => {resetContent()}}>
                                        <Image source={require('../assets/reset.png')} style={{height:30,width:30,marginRight:'10%'}} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setToggle(!toggle)}}>
                                        <Image source={require('../assets/cross.png')} style={{height:30,width:30}} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{height:windowHeight*0.05,width:'90%',alignSelf:'center',marginVertical:'5%'}}>
                                <TextInput value={title} underlineColorAndroid={"transparent"} onChangeText={(text) => {setTitle(text)}} autoCorrect={false}  numberOfLines={1} placeholder="Title" style={{color:'#999ca1',fontFamily :'SpaceMono_400Regular',textDecorationLine:'none',height:'100%',width:'100%',borderBottomColor:'#c7c7c7',borderBottomWidth:1,fontSize:28}} />
                            </View>
                            
                            <View style={{height:windowHeight*0.03,width:'90%',alignSelf:'center',flexDirection:'row'}}>
                                <TouchableOpacity style={{width:'20%',height:'100%'}} onPress={() => handleSelected(0)}>
                                    <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:selected==0?'#34ba92':'#ababab'}}>
                                        <Text style={{fontFamily :'SpaceMono_400Regular',fontSize:18,color:selected==0?'#34ba92':'#ababab'}}>Text</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'20%',height:'100%'}} onPress={() => handleSelected(1)}>
                                    <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:selected==1?'#34ba92':'#ababab'}}>
                                        <Text style={{fontFamily :'SpaceMono_400Regular',fontSize:18,color:selected==1?'#34ba92':'#ababab'}}>Media</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {selected==1?
                                <View style={{height:windowHeight*0.30,width:'90%',marginVertical:10,borderWidth:1,borderStyle:'dashed',flexDirection:'column',borderColor:'#999ca1',borderRadius:8,alignSelf:'center',justifyContent:'space-around',alignItems:'center'}}>
                                        <Animated.View style={{flexDirection:'column',marginVertical:'5%'}}>
                                            <TouchableOpacity onPress={() => {selectFile()}} style={{justifyContent:'center',alignItems:'center'}}>
                                                <Image style={{height:30, width:30, tintColor:'#999ca1'}} source={require('../assets/upload.png')}/>
                                                <Text style={{fontSize:16,color:'#999ca1',fontFamily :'SpaceMono_400Regular'}}>Upload File!</Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                        {
                                            file.length>0 ?
                                                <ScrollView horizontal={false} style={{flexDirection:'column',maxHeight:windowHeight*0.2,minWidth:'90%',alignSelf:'center',marginHorizontal:'2.5%'}}>
                                                    <RenderFiles/>
                                                </ScrollView>:null
                                        }
                                </View>
                                :
                                <View style={{height:windowHeight*0.25,width:'90%',marginVertical:'5%',alignSelf:'center',flexDirection:'column',justifyContent:'flex-start',alignContent:'flex-start'}}>
                                    <TextInput value={content} onChangeText={(text) => {setContent(text)}} autoFocus={true} multiline={true} placeholder={"Content"} style={{fontSize:20 ,fontFamily :'SpaceMono_400Regular'}} />
                                </View>
                            }

                            <View style={{height:windowHeight*0.05,width:'90%',zIndex:2,position:'absolute',marginTop:windowHeight*0.525,flexDirection:'row',alignSelf:'center',justifyContent:'flex-end',alignItems:'center'}}>
                                {editMode ?
                                <TouchableOpacity style={{marginRight:'2.5%'}} onPress={() => {deleteCard()}}>
                                    <View style={{height:windowHeight*0.05,width:windowHeight*0.05, borderRadius:windowHeight*0.05,borderWidth:1,borderColor:'#e6a5a1',backgroundColor:'#e63629',justifyContent:'center',alignItems:'center'}}>
                                        <Image source={require('../assets/delete.png')} style={{height:20,width:20,tintColor:'#e6a5a1'}} />
                                    </View>
                                </TouchableOpacity>:null}
                                <TouchableOpacity onPress={() => {handleNewEntry()}}>
                                    <View style={{height:windowHeight*0.05,width:windowHeight*0.05, borderRadius:windowHeight*0.05,borderWidth:1,borderColor:'#3df2b6',backgroundColor:'#216e54',justifyContent:'center',alignItems:'center'}}>
                                        <Image source={require('../assets/check.png')} style={{height:20,width:20,tintColor:'#3df2b6'}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
        </SafeAreaView>
    )
}

export default ShareCard;

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

    ModalBackground : {
        height:'100%',
        width:'100%',
        alignSelf:'flex-end',
        borderRadius:8,
        backgroundColor:'rgba(0, 0, 0, 0.5)' ,
        justifyContent:'center',
        alignItems:'center'
    },

});