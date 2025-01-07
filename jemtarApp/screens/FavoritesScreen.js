import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFavorites = async () => {
        try {
            const existingFavorites = await AsyncStorage.getItem('favorites');
            if (existingFavorites) {
                setFavorites(JSON.parse(existingFavorites));
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const removeFavorite = async (item) => {
        try {
            const existingFavorites = await AsyncStorage.getItem('favorites');
            const favoritesArray = existingFavorites ? JSON.parse(existingFavorites) : [];
            const updatedFavorites = favoritesArray.filter(favorite => favorite.name !== item.name);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            fetchFavorites(); // Refresh the favorites list
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFavorites(); // Ambil ulang daftar favorit
        setRefreshing(false);
    };

    const handleShare = (item) => {
        console.log('Mencoba membagikan:', item);
        const message = `Rute Favorit:\nNama: ${item.name}\nJemput: ${item.pickup}\nAntar: ${item.dropoff}\nJarak: ${item.distance} km\nHarga: Rp ${item.price}\nTanggal: ${item.date}\nWaktu: ${item.time}`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch((err) => {
            console.error('Error opening WhatsApp:', err);
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.favoriteItem}>
            <Text>Nama: {item.name}</Text>
            <Text>Jemput: {item.pickup}</Text>
            <Text>Antar: {item.dropoff}</Text>
            <Text>Jarak: {item.distance} km</Text>
            <Text>Harga: Rp {item.price}</Text>
            <Text>Tanggal: {item.date}</Text>
            <Text>Waktu: {item.time}</Text>
            <Text>-------------------------</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => removeFavorite(item)} style={styles.deleteButton}>
                    <Icon name="trash-bin-outline" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareButton}>
                    <Icon name="share-social-outline" size={24} color="blue" style={styles.shareIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rute Favorit</Text>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={onRefresh}
                refreshing={refreshing}
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
    favoriteItem: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    deleteButton: {
        // Tambahkan gaya jika diperlukan
    },
    shareIcon: {
        marginLeft: 10,
    },
});

export default FavoriteScreen; 