import React from 'react';
import { Card, Text } from 'react-native-paper';

const OrderCard = ({ order }) => {
    return (
        <Card style={{ marginBottom: 10 }}>
            <Card.Content>
                <Text>{order.detail}</Text>
            </Card.Content>
        </Card>
    );
};

export default OrderCard; 