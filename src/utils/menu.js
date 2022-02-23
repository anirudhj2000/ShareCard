import React, { useRef } from "react";
import {useState , useEffect } from "react";
import {View,Dimensions,Text,Image} from 'react-native';
import { Provider,Menu,Button } from "react-native-paper";

const MenuOptions = (props) => {


    return(
        <Provider>
             <View
                style={{
                }}>
                <Menu
                visible={props.visible}
                onDismiss={props.closeMenu}
                anchor={props.anchor}>
                    <Menu.Item onPress={props.onPressEdit} title="Edit" />
                    <Menu.Item onPress={props.onPressDelete} title="Delete" />
                </Menu>
            </View>
        </Provider>
    )
}

export default MenuOptions;