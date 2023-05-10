import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, VirtualizedList, Image, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import { Header } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../utilities/firebase'
import * as Location from 'expo-location';
import { EBIRD_API_TOKEN } from '@env';

export default function SightingsScreen() {
    const [birdSightings, setBirdSightings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation()

    //Fetch the user's current location and recent bird sightings by sending a request to the eBird API
    useEffect(() => {
        const fetchBirdData = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                const response = await fetch(
                    `https://api.ebird.org/v2/data/obs/geo/recent?lat=${latitude}&lng=${longitude}`,
                    {
                        headers: {
                            'X-eBirdApiToken': EBIRD_API_TOKEN,
                        },
                    }
                );

                const data = await response.json();
                setIsLoading(false);
                setBirdSightings(data);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchBirdData();
    }, []);

    //Logout user from Firebase authentication and redirect to the login screen
    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    // Render loading screen while data is being fetched
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2b4e73" />
            </View>
        );
    }

    // Handles date and returns display information about the recent bird sightings
    const renderBirdSighting = ({ item }) => {
        const { comName, sciName, howMany, obsDt, locName, speciesCode } = item;

        const formattedDate = new Date(obsDt).toLocaleString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <View style={styles.sightingContainer} key={speciesCode}>
                <Text style={styles.sightingTitle}>{comName}</Text>
                <Text style={styles.sightingText}>Scientific name: {sciName}</Text>
                <Text style={styles.sightingText}>
                    {howMany} located in {locName.replace(/ -+ /g, ', ').replace(/-+/g, ', ')}
                </Text>
                <View style={styles.ending}>
                    <Text style={styles.sightingText}>
                        Time of sighting: {formattedDate}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(`https://ebird.org/species/${speciesCode}`)
                        }
                    >
                        <MaterialCommunityIcons
                            name="search-web"
                            size={24}
                            color="#2b4e73"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    //Render header and VirtualizedList component
    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#2b4e73"
                leftComponent={<Image source={require('../assets/birdWatcher_logo.png')} style={styles.logo} />}
                centerComponent={{ text: 'New Sightings', style: { color: '#fff', fontSize: 24 } }}
                rightComponent={<MaterialCommunityIcons name="logout" size={30} onPress={handleSignOut} color="white" />}
            />
            <VirtualizedList
                data={birdSightings}
                initialNumToRender={10}
                renderItem={renderBirdSighting}
                keyExtractor={item => item.speciesCode}
                getItemCount={data => data.length}
                getItem={(data, index) => data[index]}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    sightingContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sightingTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#2b4e73',
    },
    sightingText: {
        fontSize: 14,
        lineHeight: 24,
    },
    listContainer: {
        paddingBottom: 20,
    },
    ending: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});