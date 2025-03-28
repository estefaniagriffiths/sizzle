import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/Auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error finding username:', error.message);
        } 
        else {
            setUsername(data.username);
        }

        setLoading(false);
        }   
    }

    getUser();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.username}>Hello, {username}!</Text>
        <TouchableOpacity
        style={styles.button}
        onPress={signOut} 
        >
        <Text style={styles.buttonText}>Log Out</Text>      
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('Search')} style={styles.navButton}>
          <Ionicons name="search" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('Home')} style={styles.navButton}>
          <Ionicons name="home" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('ProfileScreen')} style={styles.navButton}>
          <Ionicons name="person" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EE9B00',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    backgroundColor: '#005F73',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingHorizontal: 20,
    width: '90%',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
});
