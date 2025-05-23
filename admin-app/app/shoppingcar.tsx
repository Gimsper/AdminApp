import { FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useShoppingCart } from '@/context/cart';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const ShoppingCar: React.FC = () => {
    const { shoppingCartItems, removeFromShoppingCart, clearShoppingCart, isScanning, setIsScanning } = useShoppingCart();

    if (!shoppingCartItems || shoppingCartItems.length === 0) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>El carrito está vacío.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerTitle: "Carrito de compras" }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Carrito de Compras</ThemedText>
                <FlatList
                    data={shoppingCartItems}
                    keyExtractor={(item: any, idx: Number) => item.itemId?.toString() || idx.toString()}
                    renderItem={({ item }) => (
                        <ThemedView style={styles.itemRow}>
                            <ThemedText style={styles.itemText}>
                                {item.name} - {item.quantity} x ${item.price}
                            </ThemedText>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeFromShoppingCart(item.itemId)}
                            >
                                <ThemedText style={styles.removeButtonText}>Eliminar</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    )}
                />
                { isScanning && <Button title='Añadir otro producto' onPress={() => setIsScanning(false)} /> }
                <Button title="Vaciar carrito" onPress={clearShoppingCart} color="#d32f2f" />
            </ThemedView>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomColor: "#aaa", borderBottomWidth: 1, padding: 8 },
    itemText: { fontSize: 16 },
    removeButton: { backgroundColor: '#e57373', padding: 8, borderRadius: 4 },
    removeButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ShoppingCar;