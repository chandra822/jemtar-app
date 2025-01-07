import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const drivers = [
    { name: 'Dhani Chandra', phone: '+6289652198683', busy: false },
    { name: 'Rahmadani', phone: '+62895386882422', busy: false },
    { name: 'Riski Ariandi', phone: '+6282392056549', busy: false },
];

const OrderScreen = () => {
    const route = useRoute();
    const { name, pickup, dropoff, estimatedDistance, price } = route.params || {};

    const [nameState, setName] = useState(name || '');
    const [pickupState, setPickup] = useState(pickup || '');
    const [dropoffState, setDropoff] = useState(dropoff || '');
    const [estimatedDistanceState, setEstimatedDistance] = useState(estimatedDistance || '');
    const [priceState, setPrice] = useState(price || 0);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [busyDrivers, setBusyDrivers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const calculatePrice = (distance) => {
        let calculatedPrice = distance * 3000;
        if (distance > 3) {
            calculatedPrice -= (distance - 3) * 1000;
        }
        setPrice(calculatedPrice);
    };

    const handleDistanceChange = (value) => {
        const distance = parseFloat(value);
        setEstimatedDistance(value);
        if (!isNaN(distance)) {
            calculatePrice(distance);
        } else {
            setPrice(0);
        }
    };

    const handleOrder = async () => {
        if (!nameState || !pickupState || !dropoffState || !estimatedDistanceState) {
            Alert.alert('Error', 'Silakan lengkapi semua field sebelum memesan.');
            return;
        }

        const message = `Hallo ${selectedDriver.name}, saya ingin memesan jemtar:\n\nPesanan dari ${nameState}:\nJemput: ${pickupState}\nAntar: ${dropoffState}\nEstimasi Jarak: ${estimatedDistanceState} km\nHarga: Rp ${priceState}\n\nBalas "maaf sibuk" jika anda tidak bisa menerima pesanan ini.`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${selectedDriver.phone}`;
        
        Linking.openURL(url)
            .then(async () => {
                // Simpan riwayat pesanan
                const orderDetails = {
                    name: nameState,
                    pickup: pickupState,
                    dropoff: dropoffState,
                    distance: estimatedDistanceState,
                    price: priceState,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                };

                try {
                    const existingOrders = await AsyncStorage.getItem('orders');
                    const orders = existingOrders ? JSON.parse(existingOrders) : [];
                    orders.push(orderDetails);
                    await AsyncStorage.setItem('orders', JSON.stringify(orders));
                    Alert.alert('Pesanan Berhasil', 'Pesanan Anda telah disimpan.');
                } catch (error) {
                    console.error('Error saving order:', error);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                Alert.alert('Error', 'Gagal membuka WhatsApp. Pastikan aplikasi WhatsApp terinstal.');
            });
    };

    const handleDriverBusy = () => {
        if (selectedDriver) {
            if (busyDrivers.length === drivers.length) {
                Alert.alert('Info', 'Maaf, semua driver sedang sibuk.');
                return;
            }
            
            setBusyDrivers([...busyDrivers, selectedDriver]);
            setSelectedDriver(null);
            Alert.alert('Driver Sibuk', `${selectedDriver.name} telah ditandai sebagai sibuk.`);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setName(name || '');
        setPickup(pickup || '');
        setDropoff(dropoff || '');
        setEstimatedDistance(estimatedDistance || '');
        setPrice(price || 0);
        setSelectedDriver(null);
        setBusyDrivers([]);
        
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    useEffect(() => {
        if (name) setName(name);
        if (pickup) setPickup(pickup);
        if (dropoff) setDropoff(dropoff);
        if (estimatedDistance) setEstimatedDistance(estimatedDistance);
        if (price) setPrice(price);
    }, [name, pickup, dropoff, estimatedDistance, price]);

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={{ flexGrow: 1 }} 
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <TextInput label="Nama" value={nameState} onChangeText={setName} style={styles.input} />
            <TextInput label="Jemput" value={pickupState} onChangeText={setPickup} style={styles.input} />
            <TextInput 
                label="Antar" 
                value={dropoffState} 
                onChangeText={setDropoff} 
                style={styles.input} 
            />
            <TextInput 
                label="Estimasi Jarak (km)" 
                value={estimatedDistanceState} 
                onChangeText={handleDistanceChange} 
                style={styles.input} 
                keyboardType="numeric" 
            />
            <Text style={styles.priceText}>Harga: Rp {priceState}</Text>
            <Text style={styles.driverText}>Pilih Driver:</Text>
            {drivers.map((driver, index) => {
                const isDriverBusy = busyDrivers.includes(driver);
                return (
                    <Button 
                        key={index} 
                        mode="outlined" 
                        onPress={() => !isDriverBusy && setSelectedDriver(driver)}
                        style={[styles.driverButton, selectedDriver === driver && styles.selectedDriver]} 
                        disabled={isDriverBusy}
                    >
                        <Text style={{ color: isDriverBusy ? 'red' : (driver.busy ? 'red' : 'black') }}>
                            {driver.name} {isDriverBusy && '(Busy)'}
                        </Text>
                    </Button>
                );
            })}
            <Button 
                mode="contained" 
                onPress={handleOrder} 
                style={styles.orderButton}
                disabled={!selectedDriver}
            >
                Pesan Sekarang
            </Button>
            <Button 
                mode="outlined" 
                onPress={handleDriverBusy} 
                style={styles.busyButton} 
                disabled={!selectedDriver}
            >
                Driver Sibuk
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 10,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    driverText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    driverButton: {
        marginVertical: 5,
    },
    orderButton: {
        marginTop: 20,
    },
    selectedDriver: {
        backgroundColor: 'lightgray',
    },
    busyButton: {
        marginTop: 20,
    },
});

export default OrderScreen; 