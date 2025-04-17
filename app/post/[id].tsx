import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';
import PostView from '../(tabs)/PostView';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ActivityIndicator } from 'react-native';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, created_at, user_id, title, image_link, description, recipe, profiles:profiles!posts_user_id_fkey (username)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!post) return <Text>Post not found</Text>;

  return <PostView post={post} />;
}

