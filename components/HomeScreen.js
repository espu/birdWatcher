import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView } from 'react-native';
import { Header } from '@rneui/base';
import { useNavigation } from '@react-navigation/core'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../utilities/firebase'

export default function HomeScreen() {
    const navigation = useNavigation();

    //Logout user from Firebase authentication and redirect to the login screen
    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch(error => alert(error.message));
    };

    //Returning header with logo, application position, and logout button
    //Application introduction text with logos and button to add a new bird sighting 
    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#2b4e73'
                leftComponent={<Image source={require("../assets/birdWatcher_logo.png")} style={styles.logo} />}
                centerComponent={{ text: 'Home', style: { color: '#fff', fontSize: 24 } }}
                rightComponent={<MaterialCommunityIcons name="logout" size={30} onPress={handleSignOut} color="white" />}
            />
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.textBox}>
                    <Image
                        source={require("../assets/birdWatcher_logo.png")}
                        style={{ width: '100%', height: undefined, aspectRatio: 3.2, alignSelf: 'center', resizeMode: 'contain', tintColor: '#fff' }}
                    />
                    <Image
                        source={require("../assets/birdWatcher_logo_text.png")}
                        style={{ width: '100%', height: undefined, aspectRatio: 3.2, alignSelf: 'center', resizeMode: 'contain', tintColor: '#fff' }}
                    />
                    <Text style={styles.paragraph}>The journal application for bird enthusiasts.
                        You can record and keep track of your bird sightings, view your
                        recent sightings with detailed information about the birds, and discover new sightings
                        from other bird watchers in your area!
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => navigation.navigate('AddSighting')}
                >
                    <Text style={styles.buttonText}>Add Sighting</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

//Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBox: {
        backgroundColor: '#2b4e73',
        padding: 25,
        paddingTop: 130,
        paddingBottom: 130,
        borderRadius: 5,
        marginHorizontal: 6,
        marginVertical: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.40,
    },
    highlightBox: {
        backgroundColor: '#2b4e73',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 6,
        marginVertical: 5,
    },
    paragraph: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    buttonContainer: {
        backgroundColor: '#2b4e73',
        padding: 11,
        marginBottom: 11,
        borderRadius: 5,
        width: '97%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});