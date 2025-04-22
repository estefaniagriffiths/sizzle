import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity,} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Image as ExpoImage } from 'expo-image';

type PostType = {
  id: string;
  title: string;
  image_link: string;
  description: string;
  ingredients?: string;
  recipe?: string;
  profiles?: {
    username: string;
  };
  post_tags?: {
    tags: {
      name: string;
    };
  }[];
};

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:profiles!posts_user_id_fkey(username), post_tags(tags(name))')
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

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 60 }} />;
  if (!post) return <Text>Post not found</Text>;

  const ingredientsList = post.ingredients?.split('\n').filter(i => i.trim() !== '');
  const recipeSteps = post.recipe?.split('\n').filter(s => s.trim() !== '');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={{ padding: 20 }}>
        <ExpoImage source={{ uri: post.image_link }} style={styles.image} contentFit="cover" />
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.username}>@{post.profiles?.username}</Text>
        <Text style={styles.description}>{post.description}</Text>

        {post.post_tags && post.post_tags.length > 0 && (
          <View style={[styles.hstack, { paddingBottom: 12, flexWrap: 'wrap' }]}>
            {post.post_tags.map((pt, index) => (
              <View key={index} style={{ paddingRight: 6, paddingBottom: 6 }}>
                <Text style={styles.tag}>{pt.tags.name}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredientsList?.map((item, index) => (
          <Text key={index} style={{ marginBottom: 5, fontSize: 15 }}>{'\u2022'} {item.trim()}</Text>
        ))}

        <Text style={styles.sectionTitle}>Recipe Steps</Text>
        {recipeSteps?.map((step, index) => (
          <Text key={index} style={{ marginBottom: 12, fontSize: 15 }}>{index + 1}. {step.trim()}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 28,
    color: 'blue',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 12,
    color: 'gray',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: 'white',
    backgroundColor: 'darkorange',
    borderRadius: 12,
  },
  hstack: {
    flexDirection: 'row',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
});

