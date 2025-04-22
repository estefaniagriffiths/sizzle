import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Session } from "@supabase/supabase-js";
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export const unstable_settings = {
  headerShown: false,
};

export default function UploadScreen() {
  const router = useRouter();

  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeSteps, setRecipeSteps] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [recipeTags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id || "");
    });

    const fetchTags = async () => {
      const { data, error } = await supabase.from('tags').select('id, name');
      if (!error && data) {
        setTags(data);
      } else {
        console.error("Error fetching tags", error);
      }
    };
  
    fetchTags();
  }, [])

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
  };

  const handleUploadRecipe = async () => {
    if (!recipeTitle || !recipeDescription || !recipeSteps || !ingredients || !imageUri) {
      Alert.alert("Missing Fields", "Please fill out all fields and select an image.");
      return;
    }
  
    try {
      setUploading(true);
  
      const fileExt = imageUri.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
  
      const fileContent = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const mimeType =
        fileExt === 'png'
          ? 'image/png'
          : fileExt === 'jpg' || fileExt === 'jpeg'
          ? 'image/jpeg'
          : 'image/*';
  
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, decode(fileContent), {
          contentType: mimeType,
          upsert: true,
        });
  
      if (uploadError) {
        console.error(uploadError);
        Alert.alert("Upload Error", "Failed to upload image.");
        return;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;
  
      console.log("Uploaded image URL:", publicUrl); 
  
      const { data: insertedPosts, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          created_at: new Date().toISOString(),
          user_id: userId,
          title: recipeTitle,
          image_link: publicUrl,
          description: recipeDescription,
          ingredients: ingredients,
          recipe: recipeSteps
        },
      ])
      .select();
  
      if (insertError) {
        console.error(insertError);
        Alert.alert("Upload Error", "Failed to save recipe data.");
        return;
      }

      const postId = insertedPosts[0].id;
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tagId => ({
          post_id: postId,
          tag_id: tagId,
        }));
      
        const { error: tagInsertError } = await supabase
          .from('post_tags')
          .insert(tagInserts);
      
        if (tagInsertError) {
          console.error("Tag insert error:", tagInsertError);
          Alert.alert("Warning", "Recipe uploaded, but tags failed to save.");
        }
      }
  
      Alert.alert("Success", "Recipe uploaded successfully!");
      setRecipeTitle('');
      setRecipeDescription('');
      setIngredients('');
      setRecipeSteps('');
      setImageUri(null);
      router.push('/'); 
  
    } catch (err) {
      console.error(err);
      Alert.alert("Unexpected Error", "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
    <Text style={styles.headerText}>Upload Your Recipe</Text>
      <ScrollView style={styles.container}>
        <Text style={styles.sub}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What's your recipe called?"
            placeholderTextColor={"darkgray"}
            maxLength={500}
            value={recipeTitle}
            onChangeText={setRecipeTitle}
          />
        <Text style={styles.sub}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your recipe."
            placeholderTextColor={"darkgray"}
            maxLength={2000}
            value={recipeDescription}
            onChangeText={setRecipeDescription}
            multiline
          />
        <Text style={styles.sub}>Ingredients (one per new line)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="What's in your recipe?"
            placeholderTextColor={"darkgray"}
            maxLength={2000}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
          />
        <Text style={styles.sub}>Steps (one per new line, no need to number!)</Text>
        <View>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="What are your recipe steps?"
          placeholderTextColor={"darkgray"}
          maxLength={2000}
          value={recipeSteps}
          onChangeText={setRecipeSteps}
          multiline
        />
        <Text style={styles.sub}>Tags</Text>
        <View style={[styles.tagContainer]}>
          {recipeTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagButton,
                  isSelected && styles.selectedTagButton
                ]}
                onPress={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag.id)
                      ? prev.filter(id => id !== tag.id)
                      : [...prev, tag.id]
                  );
                }}
              >
              <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>
              {tag.name}
            </Text>
          </TouchableOpacity>
          );
        })}
        </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
          <Text style={styles.buttonText}>{imageUri ? "Image Selected" : "Select Image"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUploadRecipe} disabled={uploading}>
          <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Upload Recipe"}</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F2F0EF',
  },
  container: {
    flex: 1,
    padding: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 80,
  },
  sub: {
    fontSize: 16,
    color: 'black',
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagButton: {
    backgroundColor: '#fff',
    borderColor: 'darkorange',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedTagButton: {
    backgroundColor: 'darkorange',
  },
  tagText: {
    color: 'darkorange',
  },
  selectedTagText: {
    color: 'white',
  },
  
});
