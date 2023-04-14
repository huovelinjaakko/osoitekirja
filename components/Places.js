import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';
import { Header, Icon, Input, Button, ListItem } from '@rneui/themed';


export default function Places({ navigation }) {

    const [address, setAddress] = useState('');
    const [items, setItems] = useState([]);

    const firebaseConfig = {
        apiKey: "AIzaSyCt0MmavL_YjFWyXkDXMjx-V38a0yGsU3U",
        authDomain: "osoitteet-69b9e.firebaseapp.com",
        databaseURL: "https://osoitteet-69b9e-default-rtdb.firebaseio.com",
        projectId: "osoitteet-69b9e",
        storageBucket: "osoitteet-69b9e.appspot.com",
        messagingSenderId: "24746650484",
        appId: "1:24746650484:web:717bec57ff9a1bf755da21"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    useEffect(() => {
        const itemsRef = ref(database, 'items/');
        onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const addresses = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
        setItems(addresses);
        });
    }, []);

    const saveItem = () => {
        push(
          ref(database, 'items/'),
          { 'address': address }
        );
    }

    const showAddress = (address) => {
      console.log(address);
      navigation.navigate('Map', { address });
    }

    renderItem = ({ item }) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.address}</ListItem.Title>
          </ListItem.Content>
          <Button type="clear" titleStyle={{ color: 'gray'}} onPress={() => showAddress(item.address)}>
            show on map
            <Icon name="chevron-right" type="material-community" color="gray" />
          </Button>
        </ListItem>
    )
    
    const listSeparator = () => {
        return (
          <View
            style={{
              height: 5,
              width: "80%",
              backgroundColor: "#fff",
              marginLeft: "10%"
            }}
          />
        );
    };

    return(
        <View style={styles.container}>
            <Input
                placeholder='Type in address' label='PLACEFINDER'
                onChangeText={address => setAddress(address)} 
                value={address} 
            />
            <View style={{marginLeft: 30, marginRight: 30}}>
            <Button type="solid" onPress={saveItem}>
                <Icon name="save" color="white" />
                Save
            </Button>
            </View>
            <FlatList 
                renderItem={renderItem}
                data={items}
                ItemSeparatorComponent={listSeparator}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff'
    }
  });