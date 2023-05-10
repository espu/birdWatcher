import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, createUserWithEmailAndPassword } from '../utilities/firebase';

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigation = useNavigation();

  //Handle sign up with Firebase, navigation to TabNavigation > HomeScreen upon sign up, and error handling
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        navigation.navigate('TabNavigation');
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("The e-mail address is already in use");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("The e-mail address is not formatted correctly");
        } else if (password !== confirmPassword) {
          Alert.alert("Passwords don't match");
        } else if (error.code === "auth/weak-password") {
          Alert.alert("The password is too weak");
        } else {
          console.log("Error message:", error.message);
        }
      });
  };

  //Return background and sign up form with buttons to sign up or cancel
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/punatulkku.jpg")}
        style={{
          height: "100%",
          justifyContent: "flex-end",
          resizeMode: "contain",
          marginTop: "-200%",
        }}
      >
        <View
          style={styles.formContainer}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign up</Text>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(input) => setEmail(input)}
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            onChangeText={(input) => setPassword(input)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            placeholder="Confirm password"
            onChangeText={(input) => setConfirmPassword(input)}
            secureTextEntry
          />
          <View style={styles.signupContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: "#2b4e73",
                padding: 10,
                margin: 5,
                borderRadius: 5,
              }}
              onPress={handleSignup}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#ABB8C3",
                padding: 10,
                margin: 5,
                borderRadius: 5,
              }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
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
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
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
  button: {
    backgroundColor: "#2b4e73",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    marginBottom: -150,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    height: 320,
    width: 460,
    borderTopLeftRadius: 99,
    borderTopRightRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    height: '100%',
    justifyContent: 'flex-end',
    resizeMode: 'contain',
    marginTop: -200,
  },
});