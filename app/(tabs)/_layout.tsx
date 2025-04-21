import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }
  
  export default function TabLayout() {
  
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'white' },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
        name="PostDetail"
        options={{
            title: 'PostDetail',
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
            headerShown: false,
        }}
      />
        <Tabs.Screen
        name="UploadScreen"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <TabBarIcon name="edit" color={color} />,
          headerShown: false,
        }}
      />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
              headerShown: false,
          }}
        />
        </Tabs>
    );
}