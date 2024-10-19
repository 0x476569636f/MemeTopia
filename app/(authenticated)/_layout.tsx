import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Tabs } from 'expo-router';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="notification" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <AntDesign name="mail" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color, size }) => <AntDesign name="user" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
};

export default _layout;
