import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator } from 'react-native';
import PostView from './PostView';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';

//Vegan, Vegetarian, Gluten Free, Dairy Free, Kosher, Halal, Nut Free, Keto, Low Sodium, Low Sugar
const TAGS = ['Vegan', 'Vegetarian', 'Dairy Free', 'Gluten Free', 'Nut Free', 'Halal', 'Kosher', 'Low Sugar', 'Low Sodium', 'Keto', 'Fish'];

const HomeView = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
            ? prev.filter((t) => t !== tag)
            : [...prev, tag]
        );
    };

    useFocusEffect(
        useCallback(() => {
            const fetchPosts = async () => {
                const { data, error } = await supabase
                .from('posts')
                .select('id, created_at, user_id, title, image_link, description, ingredients, recipe, profiles:profiles!posts_user_id_fkey (username), post_tags(tags(name))')
                .order('created_at', { ascending: false });
            
                console.log("Fetched posts:", data);
            
                if (error) {
                console.error('Error fetching posts:', error);
                } else {
                setPosts(data || []);
                }
            
                setLoading(false);
            };
            
            fetchPosts();
            }, [])
    );

    const filteredPosts = selectedTags.length === 0
        ? posts
        : posts.filter((post) => {
            const tagNames: string[] = post.post_tags?.map(
            (pt: { tags: { name: string } }) => pt.tags.name
            ) || [];
    
            return selectedTags.every((tag: string) => tagNames.includes(tag));
        });


    return (
        <View style={styles.container}>
            <View style={styles.navigationBar}>
                <Text style={styles.title}>Home</Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.filterButton}
                >
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Tags</Text>
                        {TAGS.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => toggleTag(tag)}
                                style={[
                                styles.tagItem,
                                selectedTags.includes(tag) && styles.tagSelected,
                                ]}
                            >
                                <Text
                                style={[
                                    styles.tagText,
                                    selectedTags.includes(tag) && styles.tagTextSelected,
                                ]}
                                >
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Pressable
                            style={styles.doneButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView
  style={styles.scrollView}
  contentContainerStyle={{ paddingBottom: 150 }}
  showsVerticalScrollIndicator={false}
>
  {loading ? (
    <ActivityIndicator size="large" color="#BB3E03" />
  ) : (
    filteredPosts.map((post) => (
      <PostView key={post.id} post={post} />
    ))
  )}
</ScrollView>
        </View>
    );
};
export default HomeView;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    },
    navigationBar: {
        width: '100%',
        paddingTop: 60,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        verticalAlign: 'middle',
        backgroundColor: "white"
    },
    title: {
        flex: 1,
        fontSize: 30,
        fontWeight: 'bold',
        padding: 12,
    },
    scrollView: {
        width: '100%',
        padding: 12
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
      filterText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    tagItem: {
        padding: 10,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        alignItems: 'center',
    },
    tagSelected: {
        backgroundColor: '#222',
        borderColor: '#222',
    },
    tagText: {
        fontSize: 16,
        color: '#333',
    },
    tagTextSelected: {
        color: 'white',
    },
    doneButton: {
        marginTop: 16,
        backgroundColor: 'black',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
    },
});