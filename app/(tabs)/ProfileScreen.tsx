import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/Auth';
import { MaterialIcons } from '@expo/vector-icons';

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

  const handleEditPress = () => {
    setIsEditing(true);
  };

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
      {/* Top-right icon button */}
      <View style={styles.topRightEdit}>
        {isEditing ? (
          <TouchableOpacity style={[styles.iconButton]} onPress={handleSavePress}>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} onPress={handleEditPress}>
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Header content: Username and Bio */}
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={editedBio}
            onChangeText={setEditedBio}
            multiline
            placeholder="Enter your bio"
          />
        ) : (
          bio && <Text style={styles.bio}>{bio}</Text>
        )}
      </View>

      {/* Footer content: Log Out button */}
      <View style={styles.topRightLogOut}>
        <TouchableOpacity style={styles.iconButton} onPress={signOut}>
          <MaterialIcons name="logout" size={24} color="white" />
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
  topRightEdit: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 2,
  },
  topRightLogOut: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 2,
  },
  header: {
    position: 'absolute',
    top: 60,
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
    width: '100%',
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
  iconButton: {
    backgroundColor: '#005F73',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
