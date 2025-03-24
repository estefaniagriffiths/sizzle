import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useAuth } from '../components/Auth';

export default function SignUpScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUpWithEmail, loading } = useAuth()

  return (
    <LinearGradient
      colors={['#EE9B00', '#BB3E03']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Join cooks from around the world.</Text>
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="username"
            autoCapitalize="none"
            placeholderTextColor="#808080"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="email@address.com"
            autoCapitalize="none"
            placeholderTextColor="#808080"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="password"
            autoCapitalize="none"
            placeholderTextColor="#808080"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
          style={styles.button} 
          onPress={() => signUpWithEmail(username, email, password)} 
          disabled={loading}
          >
          <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Link href='SignInScreen' style={styles.signInLink}>Sign In</Link>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 150,
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginBottom: 80,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 50,
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 15
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
  },
  signInLink: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#005F73',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
