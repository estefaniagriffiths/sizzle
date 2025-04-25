import { useLocalSearchParams, useFocusEffect, useRouter } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Image as ExpoImage } from 'expo-image';
import CommentView from '../CommentView';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

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
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    if (post?.id == null) {
      console.log("id is null: ", post?.id)
      return;
    }
    const { data, error } = await supabase
    .from('comments')
    .select('created_at, user_id, content')
    .eq('post_id', post?.id)
    .order('created_at', { ascending: false });

    console.log('Fetched comments:', data);

    if (error) {
    console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

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
      }

      setLoading(false);
    }
  }

  useFocusEffect(
  useCallback(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        // setSession(session);//
        setUserId(session?.user?.id || "");
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        // setSession(session);
        setUserId(session?.user?.id || "");
      });      

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

    getUser();

    console.log("fetching posts...")
    fetchPost();
    console.log("fetching comments...")
    fetchComments();
  }
  ,
  [id]));

  

  const handlePostComment = async () => {
      // if (!newCommentContent) {
      //   Alert.alert("Missing Fields", "Please fill out all fields and select an image.");
      //   return;
      // }
      console.log("comment: ", newCommentContent)
      console.log("post: ", newCommentContent)
      console.log("user id: ", userId)
      console.log("post id: ", post?.id)
      if (post?.id == null) {
        return;
      }
    
      try {
        setPosting(true);
    
        const { data: insertedComments, error: insertError } = await supabase
        .from('comments')
        .insert([
          {
            created_at: new Date().toISOString(),
            user_id: userId,
            content: newCommentContent,
            post_id: post?.id
          },
        ])
        .select();
    
        if (insertError) {
          console.error(insertError);
          Alert.alert("Post Error", "Failed to save comment data.");
          return;
        }
  
        const commentId = insertedComments[0].id;
    
        Alert.alert("Success", "Comment posted successfully!");
    
      } catch (err) {
        console.error(err);
        Alert.alert("Unexpected Error", "Something went wrong.");
      } finally {
        setPosting(false);
        getUser();
        console.log("user: ", username);
        fetchComments();
      }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 60 }} />;
  if (!post) return <Text>Post not found</Text>;

  const ingredientsList = post.ingredients?.split('\n').filter(i => i.trim() !== '');
  const recipeSteps = post.recipe?.split('\n').filter(s => s.trim() !== '');

  return (
    <View style={{ padding: 20, marginTop: 50, marginBottom: 64 }}>
      <ScrollView>
        <ExpoImage source={{ uri: post.image_link }} style={styles.image} contentFit="cover" />
        <Text style={styles.user}>@{post.profiles?.username}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        {post.post_tags && post.post_tags.length > 0 && (
          <View style={[styles.hstack, { flexWrap: 'wrap' }]}>
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
        {loading ? (
            <ActivityIndicator size="large" color="#BB3E03" />
        ) : (
            comments.map((comment) => (
                <CommentView comment={comment} username={username} />
            ))
        )}
      </ScrollView>
      <KeyboardAvoidingView
          style={{flex: 1}}
          keyboardVerticalOffset={100}
          behavior={"position"}
        >
        <View style={[styles.hstack, {width: '100%', height: 60, backgroundColor: "#F2F2F7FF"}]}>
        <TextInput
            style={styles.input}
            placeholder="Reply"
            placeholderTextColor={"lightgray"}
            maxLength={500}
            value={newCommentContent}
            onChangeText={setNewCommentContent}
        />
        <TouchableOpacity onPress={handlePostComment} disabled={posting}>
          <FontAwesome style={{paddingLeft: 10, paddingTop: 20}} name="paper-plane" size={18} color="black" />
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
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
  user: {
    fontSize: 16,
    color: 'darkorange',
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
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
  input: {
    width: '90%',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
  },
});

