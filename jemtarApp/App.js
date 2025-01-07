import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import OrderScreen from './screens/OrderScreen';
import HistoryScreen from './screens/HistoryScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon name="home" color={color} size={size} />
                            ),
                        }} 
                    />
                    <Tab.Screen 
                        name="Pesan" 
                        component={OrderScreen} 
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon name="send" color={color} size={size} />
                            ),
                        }} 
                    />
                    <Tab.Screen 
                        name="Riwayat" 
                        component={HistoryScreen} 
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon name="history" color={color} size={size} />
                            ),
                        }} 
                    />
                    <Tab.Screen 
                        name="Favorit" 
                        component={FavoritesScreen} 
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon name="favorite" color={color} size={size} />
                            ),
                        }} 
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
