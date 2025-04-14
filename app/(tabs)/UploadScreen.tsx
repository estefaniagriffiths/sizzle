import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Session } from "@supabase/supabase-js";

export const unstable_settings = {
  headerShown: false,
};

export default function UploadScreen() {
  const router = useRouter();

  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    });
  }, [])

  const handleSelectVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled && result.assets.length > 0) {
        setVideoUri(result.assets[0].uri);
      }
  };

  const handleUploadRecipe = async () => {
    // if (!recipeTitle || !recipeDescription || !ingredients || !dietaryTags || !videoUri) {
    //   Alert.alert("Missing Fields", "Please fill in all fields and select a video.");
    //   return;
    // }

    setUploading(true);

    try {
      // Fetch video file as a blob
      const response = await fetch(videoUri);
      const blob = await response.blob();

      // Generate a unique file name using current timestamp and the original extension
      const fileExt = videoUri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload video to Supabase storage (assumes a bucket named "videos" exists)
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, blob, {
          contentType: 'video/mp4',
        });

      if (uploadError) {
        Alert.alert("Upload Error", uploadError.message);
        setUploading(false);
        return;
      }

      // Get the public URL for the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Insert recipe details and video URL into the "recipes" table
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            created_at: new Date().toISOString(),
            user_id: userId,
            title: recipeTitle,
            image_link: publicUrl,
            description: recipeDescription,
            recipe: ingredients,
          },
        ]);

      if (insertError) {
        Alert.alert("Database Error", insertError.message);
        setUploading(false);
        return;
      }

      Alert.alert("Success", "Recipe uploaded successfully!");
      router.push('(tabs)');
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while uploading the recipe.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={['#EE9B00', '#BB3E03']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Upload Your Recipe</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          maxLength={500}
          value={recipeTitle}
          onChangeText={setRecipeTitle}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Recipe Description"
          maxLength={2000}
          value={recipeDescription}
          onChangeText={setRecipeDescription}
          multiline
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Ingredients (Must be separated by commas)"
          maxLength={2000}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSelectVideo}>
          <Text style={styles.buttonText}>{videoUri ? "Video Selected" : "Select Video"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUploadRecipe} disabled={uploading}>
          <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Upload Recipe"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#005F73',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
});
