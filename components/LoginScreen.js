import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, signInWithEmailAndPassword } from '../utilities/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation();

  //Handle login with Firebase and error handling
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate('TabNavigation');
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          Alert.alert("E-mail or password is incorrect");
        } else if (error.code === "auth/wrong-password") {
          Alert.alert("E-mail or password is incorrect");
        } else {
          console.log("Error message:", error.message);
        }
      });
  }

  //Navigate to SignupScreen in the stack
  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  //Return (render) image, logo, and login form with buttons to login or sign up
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground source={require("../assets/punatulkku.jpg")} style={{ height: '100%', justifyContent: 'flex-end', resizeMode: 'contain', marginTop: -350 }}>
        <Image source={require("../assets/birdWatcher_logo_text.png")} style={styles.logo} />
        <View
          style={{
            backgroundColor: 'white',
            height: 250,
            width: 460,
            borderTopLeftRadius: 99,
            borderTopRightRadius: 99,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <View style={{ position: "absolute" }}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Login</Text>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Email"
              autoCapitalize='none'
              onChangeText={input => setEmail(input)}
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Password"
              onChangeText={input => setPassword(input)}
              secureTextEntry
            />
            <View style={styles.signupContainer}>
              <TouchableOpacity
                style={{ backgroundColor: "#2b4e73", padding: 10, margin: 5, borderRadius: 5, width: 70 }}
                onPress={handleLogin}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#2b4e73", padding: 10, margin: 5, borderRadius: 5, width: 70 }}
                onPress={handleSignup}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 70,
  },
  input: {
    height: 50,
    width: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    marginBottom: -30,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    position: 'absolute',
    top: '76%',
    left: '62%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    tintColor: '#fff',
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 10.00,
    shadowRadius: 1.5,
  },
});