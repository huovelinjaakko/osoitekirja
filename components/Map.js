import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ route }) {

    const [selectedAddress, setSelectedAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState({});

    useEffect(() => {
        if (route.params?.address) { 
            setSelectedAddress(route.params.address);
        }
    }, [route.params]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=tHALcNsWXHEwQT9rb7E2l0reysEF61as&location=${selectedAddress}`);
                const data = await response.json();
                if (data.results && data.results[0].locations && data.results[0].locations[0].displayLatLng) {
                    const { lat, lng } = data.results[0].locations[0].displayLatLng;
                    setLocation({ latitude: lat, longitude: lng });
                } else {
                    console.log('Error fetching location: Invalid data format');
                }
            } catch (error) {
                console.log('Error fetching location:', error);
            } finally {
                setLoading(false);
            }
        };
        if (selectedAddress) {
            fetchLocation();
        }
    }, [selectedAddress]);

    return(
        <View style={styles.container}>
            {loading ? (
                <Text>Loading location...</Text>
            ) : (
                <MapView.Marker coordinate={location} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
});