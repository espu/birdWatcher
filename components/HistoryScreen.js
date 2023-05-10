import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, Alert, Share, Linking } from 'react-native';
import { Header, Card } from '@rneui/base';
import { useNavigation } from '@react-navigation/core'
import { auth, database, ref, onValue, remove } from '../utilities/firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
    const [sightings, setSightings] = useState([]);
    const navigation = useNavigation()

    //Gather bird sightings data from Firebase and transforms the data into an array of sightings
    useEffect(() => {
        const userId = auth.currentUser.uid;
        const sightingsRef = ref(database, `sightings/${userId}`);
        onValue(sightingsRef, (snapshot) => {
            const sightingsData = snapshot.val();
            const sightingsList = Object.values(sightingsData || {}).map((sighting, index) => ({ id: index, ...sighting }));
            setSightings(sightingsList);
        });
    }, []);

    //Handle deletion of a bird sighting from Firebase upon agreement
    const handleDelete = (id) => {
        const userId = auth.currentUser.uid;
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this sighting?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        remove(ref(database, `sightings/${userId}/${id}`))
                            .then(() => {
                                console.log('Sighting deleted successfully');
                            })
                            .catch(error => console.log(error));
                    }
                }
            ]
        );
    }

    //Share bird sighting through various platform
    const handleShare = async (sighting) => {
        try {
            await Share.share({
                message: `I spotted a ${sighting.comName} (${sighting.sciName}) in ${sighting.location} on ${sighting.time}! All I can say is: ${sighting.comment}`
            });
        } catch (error) {
            console.error(error);
        }
    };

    //Logout user from Firebase authentication and redirect to the login screen
    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    //Return header, ScrollView with React Native Elements card to display bird sightings, 
    //and buttons to delete, share, and look up (images and information)
    return (
        <View style={{ flex: 1 }}>
            <Header
                backgroundColor='#2b4e73'
                leftComponent={<Image source={require("../assets/birdWatcher_logo.png")} style={styles.logo} />}
                centerComponent={{ text: 'History', style: { color: '#fff', fontSize: 24 } }}
                rightComponent={<MaterialCommunityIcons name="logout" size={30} onPress={handleSignOut} color="white" />}
            />
            <ScrollView>
                {sightings.map((sighting) => (
                    <Card key={sighting.id}>
                        <Card.Title>{sighting.comName}</Card.Title>
                        <Card.Divider />
                        <Text style={styles.label}>Scientific name:</Text>
                        <Text style={styles.text}>{sighting.sciName}</Text>
                        <Text style={styles.label}>Location:</Text>
                        <Text style={styles.text}>{sighting.location}</Text>
                        <Text style={styles.label}>Time:</Text>
                        <Text style={styles.text}>{sighting.time}</Text>
                        <Text style={styles.label}>Comment:</Text>
                        <Text style={styles.text}>{sighting.comment}</Text>
                        <Card.Divider />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(sighting.id)}>
                                <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => Linking.openURL(`https://media.ebird.org/catalog?sort=rating_rank_desc&taxonCode=${sighting.speciesCode}`)}>
                                <MaterialCommunityIcons name="image-search-outline" size={22} color="#2b4e73" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => Linking.openURL(`https://ebird.org/species/${sighting.speciesCode}`)}>
                                <MaterialCommunityIcons name="search-web" size={24} color="#2b4e73" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleShare(sighting)}>
                                <MaterialCommunityIcons name="share-outline" size={24} color="#2b4e73" />
                            </TouchableOpacity>

                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

//Styling
const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#2b4e73',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
            backgroundColor: '#fff',
            borderRadius: 5
        }
    });