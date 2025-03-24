import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
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
      <Text style={styles.username}>Hello, {username}!</Text>
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
  username: {
    fontSize: 16,
    color: 'white',
  },
});
