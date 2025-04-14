import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/Auth';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [editedBio, setEditedBio] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error retrieving profile:', error.message);
        } else {
          setUsername(data.username);
          setBio(data.bio);
          setEditedBio(data.bio || '');
        }
        setLoading(false);
      }
    }
    getUser();
  }, []);

  // Handler for toggling the edit mode
  const handleEditPress = () => {
    setIsEditing(true);
  };

  // Handler for saving the updated bio
  const handleSavePress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: editedBio })
        .eq('id', user.id);
      if (error) {
        console.error('Error updating bio:', error.message);
      } else {
        setBio(editedBio);
        setIsEditing(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header: Username and Bio */}
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        {isEditing ? (
          <>
            <TextInput
              style={styles.textInput}
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
              placeholder="Enter your bio"
            />
            <TouchableOpacity style={styles.button} onPress={handleSavePress}>
              <Text style={styles.buttonText}>Save Bio</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {bio && <Text style={styles.bio}>{bio}</Text>}
            <TouchableOpacity style={[styles.button, styles.fixedButton]} onPress={handleEditPress}>
            <Text style={styles.buttonText}>Edit Bio</Text>
            </TouchableOpacity>

          </>
        )}
      </View>

      {/* Lower section: Log Out button remains as before */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE9B00',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  bio: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  textInput: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    marginTop: 5,
    borderRadius: 4,
    width: 250,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#005F73',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  fixedButton: {
    width: 150,  // Fixed width, adjust as needed
    height: 50,  // Fixed height if desired; remove if you want flexible height
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
