import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const PostView = () => {
    return (
        <View style={styles.container}>
            <View style={styles.post}>
                <Image source={require('./chocolate-cake-and-ice-cream-recipe.jpeg')} style={styles.image}/>
                <View style={[styles.align_left, {padding: 12}]}>
                    <Text style={[styles.title, {paddingBottom: 6}]}>Triple Layer Chocolate Cake</Text>
                    <Text style={{paddingBottom: 12}}>Description goes here</Text>
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
        </View>
    );
};
export default PostView;

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
    }
});