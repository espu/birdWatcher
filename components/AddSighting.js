import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, TextInput, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/core';
import { auth, database, set, ref, push } from '../utilities/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { EBIRD_API_TOKEN } from '@env';

export default function AddSighting() {
    const [comName, setComName] = useState('');
    const [sciName, setSciName] = useState('');
    const [speciesCode, setSpeciesCode] = useState('');
    const [time, setTime] = useState(new Date());
    const [location, setLocation] = useState('');
    const [comment, setComment] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birdList, setBirdList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectBird, setSelectBird] = useState('');
    const navigation = useNavigation();

    //useEffect hook to fetch the bird list from eBird API when the component is loaded
    useEffect(() => {
        fetch('https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=en&cat=species&countryCode=FI', {
            headers: {
                'X-eBirdApiToken': EBIRD_API_TOKEN,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const birdData = data.map((bird) => ({ comName: bird.comName, sciName: bird.sciName, speciesCode: bird.speciesCode }))
                setBirdList(birdData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    //useEffect hook to request permission for the user location and format the location by using reverseGeocode
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log(('Permission to access location denied'))
            return;
          }
      
          let requestedLocation = await Location.getCurrentPositionAsync({});
          let geocode = await Location.reverseGeocodeAsync(requestedLocation.coords);
      
          let formattedLocation = `${geocode[0].name}, ${geocode[0].city} (${requestedLocation.coords.latitude.toFixed(3)}, ${requestedLocation.coords.longitude.toFixed(3)})`;
          setLocation(formattedLocation);
        })();
      }, []);

    //Save a new sighting with bird name, scientific name, speciesCode, time, location and comment to the Firebase database
    const handleSaveSighting = () => {
        const uid = auth.currentUser.uid;
        const sightingRef = push(ref(database, `sightings/${uid}`));
        const sightingData = {
            id: sightingRef.key,
            comName,
            sciName,
            speciesCode,
            time: time.toString(),
            location,
            comment,
        };
        set(sightingRef, sightingData)
            .then(() => {
                console.log('Sighting saved');
                console.log(sightingData);
                navigation.goBack();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Handle date when user selects a time from the date picker
    const handleDate = (event, selectedDate) => {
        const currentDate = selectedDate || time;
        setShowDatePicker(false);
        setTime(currentDate);
    };

    //Adds checkmark to the selected bird
    const handleBirdSelect = (birdItem) => {
        const birdSelection = birdList.find((bird) => bird.comName === birdItem.comName);
        setComName(birdSelection.comName);
        setSciName(birdSelection.sciName);
        setSpeciesCode(birdSelection.speciesCode);
        setSelectBird(birdItem.comName);
    };

    //Render loading screen while data is loading
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2b4e73" />
            </View>
        );
    }

    //Returning birdwatcher logo, search box with a FlatList of birds to choose, datetimepicker, 
    //buttons to save sighting or cancel, and location + comment text input
    //Avoiding overlap of the input fields with the keyboard on iOS devices
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <Image source={require("../assets/birdWatcher_logo.png")} style={{ width: 100, height: 100, alignSelf: 'center' }} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={comName}
                        onChangeText={(text) => setComName(text)}
                        placeholder="Search bird name"
                    />
                </View>
                <View style={styles.scrollContainer}>
                    <FlatList
                        data={birdList.filter((item) =>
                            item.comName.toLowerCase().includes(comName.toLowerCase())
                        )}
                        keyExtractor={(item) => item.speciesCode}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleBirdSelect(item)}>
                                <View style={styles.separator} />
                                <View style={styles.rowEnding}>
                                    <Text style={styles.scrollText}>
                                        {item.comName}
                                        {selectBird === item.comName && <Text> ✓</Text>}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.rowEnding}
                                        onPress={() =>
                                            Linking.openURL(`https://ebird.org/species/${item.speciesCode}`)
                                        }
                                    >
                                        <MaterialCommunityIcons
                                            name="search-web"
                                            size={20}
                                            color="#2b4e73"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                    /></View>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ fontSize: 14, textAlignVertical: 'center', textAlign: 'left' }}>{time.toLocaleString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={time}
                        mode="datetime"
                        display="spinner"
                        onChange={handleDate}
                        format="DD-MM-YYYY HH:mm"
                        style={{ height: 140, width: 300 }}
                    />
                )}
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                    placeholder="Enter location"
                />
                <TextInput
                    style={styles.input}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    placeholder="Enter comment"
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#2b4e73", padding: 10, margin: 5, borderRadius: 5, width: 80, height: 40 }}
                        onPress={handleSaveSighting}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: "#ABB8C3", padding: 10, margin: 5, borderRadius: 5, width: 80, height: 40 }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Text style={{ color: '#000', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                </View></KeyboardAvoidingView>
        </View>
    );
}

//Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ABB8C3",
        marginVertical: 5,
        justifyContent: "center",
    },
    scrollContainer: {
        maxHeight: 150,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "#ABB8C3",
        marginVertical: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#2b4e73",
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        flexGrow: 1,
    },
    scrollText: {
        fontSize: 11,
    },
    rowEnding: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 5,
    }
});






