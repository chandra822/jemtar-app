import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const HistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const existingOrders = await AsyncStorage.getItem('orders');
            if (existingOrders) {
                setOrders(JSON.parse(existingOrders));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders().then(() => setRefreshing(false));
    }, []);

    const addToFavorites = async (item) => {
        try {
            const existingFavorites = await AsyncStorage.getItem('favorites');
            const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
            favorites.push(item);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Item ditambahkan ke favorit!');
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text>Nama: {item.name}</Text>
            <Text>Jemput: {item.pickup}</Text>
            <Text>Antar: {item.dropoff}</Text>
            <Text>Jarak: {item.distance} km</Text>
            <Text>Harga: Rp {item.price}</Text>
            <Text>Tanggal: {item.date}</Text>
            <Text>Waktu: {item.time}</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(item)}>
                <Icon name="heart" size={30} color="#FF0000" />
            </TouchableOpacity>
            <Text>-------------------------</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Riwayat Pesanan</Text>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItem: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        position: 'relative',
    },
    favoriteButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        padding: 10,
    },
    favoriteButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default HistoryScreen; 