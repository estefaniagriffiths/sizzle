import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, FlatList, Dimensions, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../components/Auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3;

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [editedBio, setEditedBio] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const { signOut } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
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

        const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, image_link')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Error loading posts:', postsError.message);
        } else {
          setPosts(postsData);
        }

        setLoading(false);
      }
    }
    getUser();
  }, [])
);

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
    <ScrollView style={styles.container}>
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
        <Text style={styles.username}>@{username}</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={editedBio}
            onChangeText={setEditedBio}
            multiline
            placeholder="Enter your bio"
            maxLength={136}
          />
        ) : (
          <Text style={styles.bio}>
            {bio?.trim() ? bio : 'No bio yet.'}
            </Text>
        )}
      </View>

      <View style={{ marginTop: 200 }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/post/${item.id}`)}
              style={{ width: imageSize, height: imageSize, padding: 0.5 }}
            >
              <ExpoImage
                source={{ uri: item.image_link }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={100}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Footer content: Log Out button */}
      <View style={styles.topRightLogOut}>
        <TouchableOpacity style={styles.iconButton} onPress={signOut}>
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0EF',
    paddingTop: 20,
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
    color: 'black',
  },
  bio: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  textInput: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    marginTop: 5,
    borderRadius: 4,
    textAlignVertical: 'top',
    width: screenWidth - 100,
    height: 90,
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
