import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

export default function PostView({ post }: { post: any }) {
    const router = useRouter();

    if (!post) return null;

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/post/${post.id}`)}>
            <ExpoImage source={{ uri: post.image_link }} style={styles.image}
            contentFit="cover"
            transition={100}
            />
            </TouchableOpacity>
            <View style={[styles.align_left, {padding: 12}]}>
                <Text style={[styles.user, {paddingBottom: 6}]}>@{post.profiles?.username}</Text>
                <Text style={[styles.title, {paddingBottom: 6}]}>{post.title}</Text>
                <Text style={{ paddingBottom: 12 }}>
                    {post.description}
                </Text>
                {post.post_tags && post.post_tags.length > 0 && (
                    <View style={[styles.hstack, { paddingBottom: 12, flexWrap: 'wrap' }]}>
                        {post.post_tags.map((pt: any, index: number) => (
                        <View key={index} style={{ paddingRight: 6, paddingBottom: 6 }}>
                            <Text style={styles.tag}>{pt.tags.name}</Text>
                        </View>
                        ))}
                    </View>
                    )}
                <View style={[styles.hstack, {paddingLeft: '60%', justifyContent: 'space-between'}]}>
                    <FontAwesome name="message" size={18} color="black" />
                    <FontAwesome name="heart" size={18} color="black" />
                    <FontAwesome name="bookmark" size={18} color="black" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    },
    post: {
        width: '100%',
        justifyContent: 'flex-end',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        backgroundColor: "white",
        borderRadius: 12,
        overflow: 'hidden'
    },
    user: {
        color: 'darkorange'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    align_left: {
        alignContent: 'flex-start',
        width: '100%'
    },
    hstack: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    image: {
        width: '100%',
        height: 400,
        resizeMode: 'cover'
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        color: 'white',
        backgroundColor: 'darkorange',
        borderRadius: 12
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#444',
        fontSize: 16,
    },
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
});