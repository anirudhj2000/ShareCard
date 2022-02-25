import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image,SafeAreaView,TextInput,ScrollView, Share,StyleSheet,TouchableOpacity,Modal,ClipboardStatic,Linking,Animated,Platform} from 'react-native';
import cardContent from "./cardContent";
// import DocumentPicker from "react-native-document-picker";
import * as DocumentPicker from 'expo-document-picker';
import RenderCards from "./renderWebCards";
import CardHeader from "./utils/cardHeader";
import MenuOptions from "./utils/menu";
import { clickProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import { Badge } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Alert } from "react-native-web";
import {GetCards,CreateCard,CreateMediaCard,DeleteCard,UploadFile, UpdateCard} from "./utils/api";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShareCardWeb = () => {
    const [toggle, setToggle] = useState(false);
    const [selected, setSelected] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [xCardContent, setCardContent] = useState(cardContent.map((a) => {return {...a}}));
    const [uploadedFile, setUploadedFile] = useState([]);
    const [xCard, setCards] = useState([]);
    const [id, setId] = useState("");
    const [editMode,setEditMode] = useState(false);
    const [file,setFile] = useState();

    const [menuToggle, setMenuToggle] = useState(false);

    const closeMenu = () => setMenuToggle(false);
    const openMenu = () => setMenuToggle(true);


    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    let slideUpAnim = useRef(new Animated.Value(25)).current;
    let slideUpAnimUpload = useRef(new Animated.Value(0)).current;

    const getIcon = (type) => {
        console.log(type);
        if(type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return require('../assets/doc.png');
        else if(type == 'application/pdf') return require('../assets/pdf.png');
        else if(type == 'image/jpeg' || type == 'image/png') return require('../assets/image-file.png');
        else return require('../assets/txt-file.png');
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
            toValue:100,
            duration:500,
            useNativeDriver:true,
        }).start();
    }

    const uploadAnimBack = () => {
        Animated.timing(slideUpAnimUpload,{
            toValue:0,
            duration:500,
            useNativeDriver:true,
        }).start();
    }

    const selectFile = async() => {
        try{
            let res = await DocumentPicker.getDocumentAsync({type:"*/*"});
            console.log(res,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            if(res.type == "success"){
                uploadAnim();
                setUploadedFile(uploadedFile.concat(res));
                let { name, size, uri } = res;
                let nameParts = name.split('.');
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                    name: name,
                    size: size,
                    uri: uri,
                    type: "application/" + fileType
                };
                console.log(fileToUpload, '...............file')
                setFile(fileToUpload);
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
        else alert("Copied");
        console.log('copied');
    };

    const handleEdit = (item) => {
        setContent(item.content);
        setTitle(item.title);
        setId(item._id);
        setEditMode(true);
        setToggle(true);
        console.log("ID:",id);
    }

    const manageFiles = (obj) => {
        var i=0;
        var xUploadfile = uploadedFile;
        console.log('lllllllll',xUploadfile);
        for(var i=0;i<xUploadfile.length;i++){
            if(xUploadfile[i].name == obj.name){
                break;
            }
            i++;
        }

        xUploadfile.splice(i,1);
        setUploadedFile(xUploadfile);
        
    }

    const RenderFiles = () =>{
        return(
            <>
                {uploadedFile.map((item) => {
                        
                        // for(var i=0;i<item.length;i++){
                            return(
                                <View style={{width:'90%',alignSelf:'center',height:windowHeight*0.05,marginVertical:5,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
                                    <TouchableOpacity onPress={() => {manageFiles(item)}} style={{position:'absolute',left:0,top:0,marginTop:-5,marginLeft:-5}}>
                                        <Badge size={14} style={{backgroundColor:'#ababab',color:'#c7c7c7',}}>x</Badge>
                                    </TouchableOpacity>
                                    <Image source={getIcon(item.mimeType)} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
                                    <Text style={{fontSize:12,marginRight:'5%'}}>{item.name}</Text>
                                    <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',height:windowHeight*0.03,width:'auto',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%'}}>
                                        <Text style={{fontSize:12,marginRight:'5%',paddingLeft:5}}>{Math.floor(item.size/1000)}</Text>
                                        <Text style={{fontSize:10,marginRight:'5%',paddingRight:5}}>KB</Text>
                                    </View>
                                </View>
                            )
                        // }
                    })

                }
                
            </>
        )
    }

    const handleNewEntry = () => {
        if(editMode){
            updateCard();
        }
        else{
            if(selected){
                AddNewCardMedia();
            }
            slideUpAnim = new Animated.Value(25);
            addNewCard();
            resetContent();
            setToggle(!toggle);
        }
    }


    const AddNewCardMedia = async() => {
        let res = await UploadFile(file);
        console.log(res);
        const media = {
            title : file.name,
            url : res.Location,
            size : file.size,
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

    const uploadMediaCard = async() => {

        const formData = new FormData();
        formData.append('file',file);
        await fetch('http://localhost:5000/cards/uploadFile',{
            method:'POST',
            body :formData,
        }).then(response => response.json()).then(res => console.log(res));


    }

    const addNewCard = async() => {
        const body = {
            firstName:"Anirudh",
            title : title,
            content : content,
            contentType :"text",
            dateCreated : Date.now(),
        
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

    const addNewCardModal = () => {
        setContent("");
        setTitle("");
        setEditMode(false);
        setToggle(!toggle);
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


    const resetContent = () => {
        setTitle("");
        setContent("");
        setUploadedFile([]);
        uploadAnimBack()
    }

    const handleSelected = (key) => {
        setSelected(key);
    }

    // () => {handleShare(item.title,item.content)

    const RenderCards1 = () => {
        cardAnim();
        return(
            <View style={{marginHorizontal:'2.5%',}}>
                {  xCard.map((item,key) => {
                    return(
                        <>
                        { key%3==0?
                            <Animated.View style={[{marginTop:slideUpAnim},{width:windowWidth*0.2,alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744',marginBottom:'5%'}]}>
                                    <CardHeader onPressCopy={() => {copyToClipboard()}} onPressEdit={() => {handleEdit(item)}} onPressShare={() => {handleShare(item.title,item.content)}}/>
                                    <View style={{width:'90%',flexDirection:'column',alignSelf:'center',marginBottom:'5%'}}>
                                        <Text style={{fontSize:24,color:'#87e0b1',marginVertical:'2.5%'}}>{item.title}</Text>
                                        <Text style={{fontSize:16,color:'#87e0b1',marginVertical:'2.5%'}}>{item.content}</Text>
                                        {
                                            item.contentType == 'media' ? 
                                                <>                                        
                                                    {
                                                        item.media.map((item1) => {
                                                            return(
                                                                <TouchableOpacity onPress={() => {Linking.openURL(item1.url)}}>
                                                                    <View style={{width:'100%',alignSelf:'center',height:windowHeight*0.05,marginVertical:5,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
                                                                        <Image source={getIcon(item1.type)} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
                                                                        <Text style={{fontSize:12,marginRight:'5%'}}>{JSON.stringify(item1.title).slice(1,15)}... {JSON.stringify(item1.title).slice(-5,-1)}</Text>
                                                                        <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',borderRadius:2,height:windowHeight*0.03,width:'20%',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%'}}>
                                                                            <Text style={{fontSize:10,marginRight:'5%',paddingLeft:5}}>{item1.size > 1000*100 ? (item1.size/(1000*1000)).toFixed(2) : (item1.size/(1000)).toFixed(2)}</Text>
                                                                            <Text style={{fontSize:10,marginRight:'5%',paddingRight:5}}>{item1.size > 1000*1000 ? "MB" : " KB"}</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )})
                                                    }
                                                </>
                                                
                                            :null
                                        }
                                    </View>
                                </Animated.View>
                        
                        :null   }
                        </>
                    )
                    
                    
                }
                )}
            </View>
        )
    }

    const RenderCards2 = () => {
        cardAnim();
        return(
            <View style={{marginHorizontal:'2.5%'}}>
                {  xCard.map((item,key) => {
                    return(
                        <>
                        { key%3==1?
                        <Animated.View style={[{marginTop:slideUpAnim},{width:windowWidth*0.2,alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744',marginBottom:'5%'}]}>
                            <CardHeader onPressEdit={() => {handleEdit(item)}} onPressShare={() => {handleShare(item.title,item.content)}}/>
                            <View style={{width:'90%',flexDirection:'column',alignSelf:'center',marginBottom:'5%'}}>
                                <Text style={{fontSize:24,color:'#87e0b1',marginVertical:'2.5%'}}>{item.title}</Text>
                                <Text style={{fontSize:16,color:'#87e0b1',marginVertical:'2.5%'}}>{item.content}</Text>
                                {
                                    item.contentType == 'media' ? 
                                        <>                                        
                                            {
                                                item.media.map((item1) => {
                                                    console.log(item1.size);
                                                    return(
                                                        <TouchableOpacity onPress={() => {Linking.openURL(item1.url)}}>
                                                            <View style={{width:'100%',alignSelf:'center',height:windowHeight*0.05,marginVertical:5,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
                                                                <Image source={getIcon(item1.type)} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
                                                                <Text style={{fontSize:12,marginRight:'5%'}}>{JSON.stringify(item1.title).slice(1,15)}</Text>
                                                                <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',borderRadius:2,height:windowHeight*0.03,width:'20%',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%'}}>
                                                                    <Text style={{fontSize:10,marginRight:'5%',paddingLeft:5}}>{item1.size > 1000*100 ? (item1.size/(1000*1000)).toFixed(2) : (item1.size/(1000)).toFixed(2)}</Text>
                                                                    <Text style={{fontSize:10,marginRight:'5%',paddingRight:5}}>{item1.size > 1000*1000 ? "MB" : " KB"}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )})
                                            }
                                        </>
                                        
                                    :null
                                }
                            </View>
                        </Animated.View>
                        :null   }
                        </>
                    )
                    
                    
                }
                )}
            </View>
        )
    }

    const RenderCards3 = () => {
        cardAnim();
        return(
            <View style={{marginHorizontal:'2.5%'}}>
                {  xCard.map((item,key) => {
                    return(
                        <>
                        { key%3==2?
                        <Animated.View style={[{marginTop:slideUpAnim},{width:windowWidth*0.2,alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744',marginBottom:'5%'}]}>
                            <CardHeader onPressEdit={() => {handleEdit(item)}} onPressShare={() => {handleShare(item.title,item.content)}}/>
                            <View style={{width:'90%',flexDirection:'column',alignSelf:'center',marginBottom:'5%'}}>
                                <Text style={{fontSize:24,color:'#87e0b1',marginVertical:'2.5%'}}>{item.title}</Text>
                                <Text style={{fontSize:16,color:'#87e0b1',marginVertical:'2.5%'}}>{item.content}</Text>
                                {
                                    item.contentType == 'media' ? 
                                        <>                                        
                                            {
                                                item.media.map((item1) => {
                                                    return(
                                                        <TouchableOpacity onPress={() => {Linking.openURL(item1.url)}}>
                                                            <View style={{width:'100%',alignSelf:'center',height:windowHeight*0.05,marginVertical:5,flexDirection:'row',alignItems:'center',borderRadius:4,backgroundColor:'#d9d9d9',borderWidth:1,borderColor:'#c7c7c7',elevation:4}}>
                                                                <Image source={getIcon(item1.type)} style={{height:windowHeight*0.03,width:windowHeight*0.03,marginHorizontal:'5%'}} />
                                                                <Text style={{fontSize:12,marginRight:'5%'}}>{JSON.stringify(item1.title).slice(1,15)}</Text>
                                                                <View style={{flexDirection:'row',position:'absolute',backgroundColor:'#ababab',borderRadius:2,height:windowHeight*0.03,width:'20%',justifyContent:'center',alignItems:'center',right:0,marginHorizontal:'2.5%'}}>
                                                                    <Text style={{fontSize:10,marginRight:'5%',paddingLeft:5}}>{item1.size > 1000*100 ? (item1.size/(1000*1000)).toFixed(2) : (item1.size/(1000)).toFixed(2)}</Text>
                                                                    <Text style={{fontSize:10,marginRight:'5%',paddingRight:5}}>{item1.size > 1000*1000 ? "MB" : " KB"}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )})
                                            }
                                        </>
                                        
                                    :null
                                }
                            </View>
                        </Animated.View>
                        :null   }
                        </>
                    )
                    
                    
                }
                )}
            </View>
        )
    }

    useEffect(() => {
        RenderCards1();
        RenderCards2();
        RenderCards3();
    },[xCard])

    useEffect(() => {
        initialAnim();
        getCards();
        console.log("vhodu")
    },[])

    useEffect(() => {
        RenderFiles();
    },[xCardContent])


    
    return(
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={{position:'absolute',bottom:0,height:windowHeight*0.05,width:'100%',backgroundColor:'#201f3d',flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
                <Text style={{fontSize:14, color:'#fff'}}>&copy; 2022</Text>
            </View>
            <View style={{height:'100%',minHeight:windowHeight,width:'80%',alignSelf:'center',borderLeftWidth:1,borderRightWidth:1,borderColor:'#87e0b1'}}>
                <Animated.View style={[{opacity:fadeAnim},{height:windowHeight*0.1,width:'auto',alignSelf:'flex-start',alignItems:'flex-end',flexDirection:'column',marginHorizontal:'5%',marginVertical:'2.5%'}]}>
                    <Text style={{fontSize:32,color:'#87e0b1',marginBottom:-10,marginRight:'5%'}}>Share</Text>
                    <Text style={{fontSize:32,color:'#deffed',marginBottom:10,marginRight:'5%'}}>Card</Text>
                </Animated.View>

                

                <TouchableOpacity style={{marginHorizontal:'5%',width:windowWidth*0.1}} onPress={() => {addNewCardModal()}}>
                <View style={{height:windowHeight*0.05,width:'100%',alignSelf:'flex-start',justifyContent:'center',alignItems:'center',borderRadius:windowHeight*0.05,borderWidth:1,borderColor:'#87e0b1',backgroundColor:'#335744'}}>
                    <Text style={{fontSize:18,color:'#87e0b1'}}>Add New</Text>
                </View>
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} style={{height:'100%',width:'90%',marginHorizontal:'5%',alignSelf:'center',marginTop:'2.5%',flexDirection:'row',marginBottom:'5%'}}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <RenderCards1/>
                        <RenderCards2/>
                        <RenderCards3/>
                    </View>
                </ScrollView>



                {/* Add Card Modal */}
                <Modal transparent={true} visible={toggle} animationType="fade"> 


                    <View style={styles.ModalBackground} >
                        <View style={{height:windowHeight*0.6,width:'50%',alignSelf:'center',backgroundColor:'#fff',borderRadius:8,borderWidth:3,borderColor:'#89c9b6'}}>
                            <View style={{height:windowHeight*0.05,width:'90%',alignSelf:'center',flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'2.5%'}}>
                                <Text style={{fontFamily:'sans-serif-medium', fontSize:24, color:'#34ba92'}}>New Card</Text>
                                <View style={{width:'40%',height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TouchableOpacity onPress={() => {resetContent()}}>
                                        <Image source={require('../assets/reset.png')} style={{height:30,width:30,marginRight:10}} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setToggle(!toggle)}}>
                                        <Image source={require('../assets/cross.png')} style={{height:30,width:30}} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{height:windowHeight*0.05,width:'90%',alignSelf:'center',marginVertical:'2.5%'}}>
                                <TextInput value={title} underlineColorAndroid={"transparent"} onChangeText={(text) => {setTitle(text)}} autoCorrect={false}  numberOfLines={1} placeholder="Title" style={{color:'#999ca1',outline: 'none',textDecorationLine:'none',height:'100%',width:'100%',borderBottomColor:'#c7c7c7',borderBottomWidth:1,fontSize:28}} />
                            </View>
                            
                            <View style={{height:windowHeight*0.02,width:'50%',marginHorizontal:'5%',alignSelf:'flex-start',flexDirection:'row',marginVertical:'2.5%'}}>
                                <TouchableOpacity style={{width:'30%',height:'100%'}} onPress={() => handleSelected(0)}>
                                    <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:selected==0?'#34ba92':'#ababab'}}>
                                        <Text style={{fontFamily:'sans-serif-medium',fontSize:24,marginBottom:10,color:selected==0?'#34ba92':'#ababab'}}>Text</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'30%',height:'100%'}} onPress={() => handleSelected(1)}>
                                    <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:selected==1?'#34ba92':'#ababab'}}>
                                        <Text style={{fontFamily:'sans-serif-medium',fontSize:24,marginBottom:10,color:selected==1?'#34ba92':'#ababab'}}>Media</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {selected==1?
                                <View style={{height:windowHeight*0.20,width:'90%',marginVertical:10,borderWidth:1,borderStyle:'dashed',flexDirection:'row',borderColor:'#999ca1',borderRadius:8,alignSelf:'center',justifyContent:'space-around',alignItems:'center'}}>
                                         {
                                            uploadedFile.length>0 ?
                                                <ScrollView horizontal={false} style={{flexDirection:'column',maxHeight:windowHeight*0.2,maxWidth:'35%',marginHorizontal:'2.5%'}}>
                                                    <RenderFiles/>
                                                </ScrollView>:null
                                        }
                                        <Animated.View style={[{marginLeft:slideUpAnimUpload},{flexDirection:'column'}]}>
                                            <TouchableOpacity onPress={() => {selectFile()}} style={{justifyContent:'center',alignItems:'center'}}>
                                                <Image style={{height:30, width:30, tintColor:'#999ca1'}} source={require('../assets/upload.png')}/>
                                                <Text style={{fontSize:16,color:'#999ca1'}}>Upload File!</Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                </View>
                                :
                                <View style={{height:windowHeight*0.25,width:'90%',alignSelf:'center',flexDirection:'column',justifyContent:'flex-start',alignContent:'flex-start'}}>
                                    <TextInput value={content} onChangeText={(text) => {setContent(text)}} autoFocus={true} multiline={true} placeholder={"Content"} style={{outline: 'none',height:'100%',fontSize:20 ,fontFamily:'sans-serif-medium'}} />
                                </View>
                            }

                            <View style={{height:windowHeight*0.05,width:'90%',zIndex:2,position:'absolute',marginTop:windowHeight*0.5,flexDirection:'row',alignSelf:'center',justifyContent:'flex-end',alignItems:'center'}}>
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

                {/* Menu */}
                

            </View>
        </ScrollView>
    )
}

export default ShareCardWeb;

const styles = StyleSheet.create({
    container : {
        height:'100%',
        width:'100%',
        backgroundColor:'#201f3d',
        flex:1,
        flexDirection:'column',
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