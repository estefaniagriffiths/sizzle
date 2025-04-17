import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

export default function PostView({ post }: { post: any }) {
    if (!post) return null;

    return (
        <View style={styles.card}>
            <ExpoImage source={{ uri: post.image_link }} style={styles.image}
            contentFit="cover"
            transition={100}
            />
            <View style={[styles.align_left, {padding: 12}]}>
                <Text style={[styles.title, {paddingBottom: 6}]}>{post.title}</Text>
                <Text style={{ paddingBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold' }}>@{post.profiles?.username}</Text> {post.description}
                </Text>
                <View style={[styles.hstack, {paddingBottom: 12}]}>
                    <View style={{paddingRight: 6}}>
                        <Text style={styles.tag}>tag</Text>
                    </View>
                    <View style={{paddingRight: 6}}>
                        <Text style={styles.tag}>another tag</Text>
                    </View>
                </View>
                <View style={[styles.hstack, {justifyContent: 'space-between'}]}>
                    <Text>Comment</Text>
                    <Text>Repost</Text>
                    <Text>Like</Text>
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
        // backgroundColor: 'green',
        // width: '100%'
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