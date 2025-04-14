import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PostView from './PostView';

const HomeView = () => {
    return (
        <View style={styles.container}>
            <View style={styles.navigationBar}>
                <Text style={styles.title}>Home</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={{paddingVertical: 12}}>
                    <PostView />
                </View>
                <View style={{paddingVertical: 12}}>
                    <PostView />
                </View>
                <View style={{paddingVertical: 12}}>
                    <PostView />
                </View>
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
        height: 100,
        justifyContent: 'flex-end',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        backgroundColor: "white"
    },
    title: {
        width: '100%',
        fontSize: 30,
        fontWeight: 'bold',
        padding: 12,
    },
    scrollView: {
        width: '100%',
        padding: 12
    }
});