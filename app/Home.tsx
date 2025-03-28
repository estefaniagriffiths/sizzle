import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

type VideoType = {
  id: number;
  url: string;
};

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase.from('videos').select('*');
        if (error) {
          console.error('Error fetching videos:', error);
        } else {
          setVideos(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: VideoType }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.url }}
        style={{ width: '100%', height: 200 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );

  return (
    <LinearGradient
          colors={['#EE9B00', '#BB3E03']}
          style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : videos.length === 0 ? (
            <Text style={styles.noVideosText}>No Videos Found</Text>
          ) : (
            <FlatList
              data={videos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push('Search')} style={styles.navButton}>
            <Ionicons name="search" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('Home')} style={styles.navButton}>
            <Ionicons name="home" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('ProfileScreen')} style={styles.navButton}>
            <Ionicons name="person" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  videoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  noVideosText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
    width: '90%',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
});
