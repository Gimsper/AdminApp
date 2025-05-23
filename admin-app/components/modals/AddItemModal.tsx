import { createItem } from '@/actions/item';
import { useEffect, useState } from 'react';

import { StyleSheet, Button, GestureResponderEvent } from 'react-native';

import { getCategories } from '@/actions/category';
import { Picker } from '@react-native-picker/picker'

import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedTextInput } from '../ThemedInput';
import { useColorScheme } from '../../hooks/useColorScheme.web';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemAdded: (newItem: any) => any;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onItemAdded }) => {
    const colorScheme = useColorScheme();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [categories, setCategories] = useState<{ categoryId: string; name: string }[]>([]);
    const [category, setCategory] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const exec = async () => {
            const response = await getCategories();
            if (response.data) {
                setCategories(response.data);
            }
        }
        exec();
    }, [])

    const validateInputs = () => {
        let error = "";
        if (name.length === 0 || name.length > 100)
            error = "El nombre no es válido"
        else if (!price || price === 0)
            error = "El precio no es válido"
        else if (!category || category === 0)
            error = "No se seleccionado una categoría"

        console.log(category)

        if (error.length !== 0) {
            setError(error);
            return false;
        }
        setError(null);
        return true;
    }

    const handleSubmit = async (e: GestureResponderEvent) => {
        setLoading(true);
        
        if (!validateInputs()) {
            setLoading(false);
            return;
        }

        try {
            const item = {
                name,
                price,
                categoryId: category,
            };

            const response = await createItem(item);
            if (response.data) {
                setName('');
                setPrice(0);
                setCategory(0);
                onItemAdded(item);
                onClose();
            } else {
                setError('No se ha podido guardar el producto, vuelva a intentarlo')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al agregar el item');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ThemedView style={styles.modalBackdrop}>
            <ThemedView style={styles.modal}>
                <ThemedText type="title" style={{ textAlign: "center" }}>Agregar producto</ThemedText>
                <div style={styles.form}>
                    <ThemedView>
                        <ThemedText>Nombre:</ThemedText>
                        <ThemedTextInput
                            defaultValue={name}
                            onChangeText={setName}
                            placeholder='Nombre'
                            maxLength={100}
                            style={{ ...styles.inputText, borderColor: colorScheme === 'dark' ? '#aaa' : '#000', color: colorScheme === 'dark' ? '#aaa' : '#000' }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <ThemedText>Precio:</ThemedText>
                        <ThemedTextInput
                            defaultValue={price.toString()}
                            onChangeText={e => setPrice(Number(e))}
                            placeholder='Precio'
                            style={{ ...styles.inputText, borderColor: colorScheme === 'dark' ? '#aaa' : '#000', color: colorScheme === 'dark' ? '#aaa' : '#000' }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <ThemedText>Categoría:</ThemedText>
                        <Picker
                            selectedValue={category}
                            onValueChange={setCategory}
                            style={{ ...styles.select, borderColor: colorScheme === 'dark' ? '#aaa' : '#000', color: colorScheme === 'dark' ? '#aaa' : '#000' }}
                        >
                            <Picker.Item label="Selecciona una opción" value="" />
                            {categories.map(cat => (
                                <Picker.Item key={cat.categoryId} label={cat.name} value={cat.categoryId} />
                            ))}
                        </Picker>
                    </ThemedView>
                    {error && <ThemedText style={styles.error}>{error}</ThemedText>}
                    <ThemedView style={styles.modalActions}>
                        <Button title={loading ? 'Agregando...' : 'Agregar'} disabled={loading} onPress={handleSubmit} />
                        <Button title='Cancelar' color='#aaa' onPress={onClose} />
                    </ThemedView>
                </div>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        padding: 24,
        borderRadius: 8,
        minWidth: 300,
        width: 400,
        minHeight: 400,
        display: "flex",
        gap: 24,
    },
    modalActions: {
        marginTop: 12,
        display: "flex",
        gap: 12,
        justifyContent: "flex-end",
    },
    error: {
        color: "red",
        marginTop: 6,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        gap: 12,
    },
    inputText: {
        height: 32,
        borderColor: '#aaa',
        borderWidth: 1,
        color: '#aaa',
        padding: 10,
        borderRadius: 5,
    },
    select: {
        backgroundColor: '#000',
        height: 32,
        borderWidth: 1,
        padding: 4,
        borderRadius: 5,
    }
});

export default AddItemModal;