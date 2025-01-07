import React from 'react';
import { View, Text, StyleSheet, Linking, BackHandler } from 'react-native';
import { Button, Appbar, Card } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const HomeScreen = ({ navigation }) => {
    const openInstagram = () => {
        Linking.openURL('https://www.instagram.com/jasa_jemtar?igsh=YTh0ZWp5cGlxMzBz');
    };

    const openWhatsApp = () => {
        Linking.openURL('https://chat.whatsapp.com/EUcHB2bEsg8AExO8UvBiYD'); 
    };

    return (
        <View style={styles.container}>
           
            <Text style={styles.welcomeText}>Welcome to Jemtar</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Tentang Jemtar</Text>
                    <Text style={styles.cardDescription}>
                        Jemtar adalah layanan transportasi antar jemput untuk mahasiswa kampus UPI YPTK  PADANG dengan tujuan kemudahan dan kenyamanan dalam perjalanan. 
                        Bergabunglah dengan Jemtar untuk pengalaman perjalanan yang lebih baik!
                    </Text>
                </Card.Content>
            </Card>
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={openInstagram} style={styles.button}>
                    Buka Instagram
                </Button>
                <Button mode="contained" onPress={openWhatsApp} style={styles.button}>
                    Buka Group WhatsApp
                </Button>
                <Button mode="contained" onPress={() => BackHandler.exitApp()} style={styles.button}>
                    Keluar
                </Button>
            </View>
            <LottieView 
                source={require('../assets/animationjmt.json')}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white', 
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', 
        textAlign: 'center',
    },
    card: {
        width: '100%', 
        marginBottom: 20,
        padding: 16,
        elevation: 4, 
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 16,
        color: '#666', 
    },
    buttonContainer: {
        flexDirection: 'column', 
        alignItems: 'stretch', 
    },
    button: {
        marginVertical: 10,
        width: '100%', 
    },
    animation: {
        width: 500, 
        height: 350, 
        alignSelf: 'center', 
        marginTop: 20, 
    },
});

export default HomeScreen; 