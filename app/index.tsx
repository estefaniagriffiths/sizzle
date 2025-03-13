import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#EE9B00', '#BB3E03']}
      style={styles.gradient}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Sizzle</Text>
      <Text style={styles.subtitle}>Discover unique recipes.</Text>
      <TouchableOpacity 
        style={styles.signUpButton} 
        onPress={() => router.push('SignUpScreen')}
      >
      <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.signInButton}
        onPress={() => router.push('SignInScreen')} 
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 80,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#0A9396',
    borderRadius: 14,
    paddingVertical: 25,
    alignItems: 'center',
    marginVertical: 30,
    width: '80%',
  },
  signInButton: {
    backgroundColor: '#005F73',
    borderRadius: 14,
    paddingVertical: 25,
    alignItems: 'center',
    marginVertical: 15,
    width: '80%',
  },
});
