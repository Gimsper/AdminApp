import { updateItem } from '@/actions/item'; 
import { useEffect, useState } from 'react';

import { StyleSheet, Button, GestureResponderEvent } from 'react-native';
import { getCategories } from '@/actions/category';

import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedTextInput } from '../ThemedInput';
import { useColorScheme } from '../../hooks/useColorScheme.web';

import { Picker } from '@react-native-picker/picker';

interface UpdateItemModalProps {
  isOpen: boolean;
  item: any; 
  onClose: () => void;
  onItemUpdated: (updatedItem: any) => void;
}

const UpdateItemModal: React.FC<UpdateItemModalProps> = ({ isOpen, onClose, onItemUpdated, item }) => {
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
        };
        exec();
    }, []);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setPrice(item.price);
            setCategory(item.categoryId);
        }
    }, [item]);

    useEffect(() => {
    if (item) {
        setName(item.name);
        setPrice(item.price);
        setCategory(item.categoryId);
    }
    }, [item]);


    const validateInputs = () => {
        let error = "";
        if (name.length === 0 || name.length > 100)
            error = "El nombre no es válido"
        else if (!price || price === 0)
            error = "El precio no es válido"
        else if (!category || category === 0)
            error = "No se ha seleccionado una categoría"

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
            const updatedItem = {
                ...item,
                name,
                price,
                categoryId: category,
            };

            const response = await updateItem(updatedItem);
            if (response.data) {
                onItemUpdated(updatedItem);
                onClose();
            } else {
                setError('No se ha podido actualizar el producto, vuelva a intentarlo');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar el item');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ThemedView style={styles.modalBackdrop}>
            <ThemedView style={styles.modal}>
                <ThemedText type="title" style={{ textAlign: "center" }}>Editar producto</ThemedText>
                <ThemedView style={styles.form}>
                    <ThemedView>
                        <ThemedText>Nombre:</ThemedText>
                        <ThemedTextInput
                            value={name}
                            onChangeText={setName}
                            placeholder='Nombre'
                            maxLength={100}
                            style={{ ...styles.inputText, borderColor: colorScheme === 'dark' ? '#aaa' : '#000', color: colorScheme === 'dark' ? '#aaa' : '#000' }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <ThemedText>Precio:</ThemedText>
                        <ThemedTextInput
                            value={price.toString()}
                            onChangeText={e => setPrice(parseInt(e))}
                            placeholder='Precio'
                            style={{ ...styles.inputText, borderColor: colorScheme === 'dark' ? '#aaa' : '#000', color: colorScheme === 'dark' ? '#aaa' : '#000' }}
                        />
                    </ThemedView>
                    <ThemedView>
                        <ThemedText>Categoría:</ThemedText>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={[styles.select, { 
                                borderColor: colorScheme === 'dark' ? '#aaa' : '#000',
                                color: colorScheme === 'dark' ? '#aaa' : '#000' 
                            }]}
                            dropdownIconColor={colorScheme === 'dark' ? '#aaa' : '#000'}
                        >
                            <Picker.Item 
                                label="Seleccione una categoría" 
                                value={0} 
                                enabled={false}
                            />
                            {categories.map(cat => (
                                <Picker.Item 
                                    key={cat.categoryId} 
                                    label={cat.name} 
                                    value={cat.categoryId} 
                                />
                            ))}
                        </Picker>
                    </ThemedView>
                    {error && <ThemedText style={styles.error}>{error}</ThemedText>}
                    <ThemedView style={styles.modalActions}>
                        <Button title={loading ? 'Actualizando...' : 'Actualizar'} disabled={loading} onPress={handleSubmit} />
                        <Button title='Cancelar' color='#aaa' onPress={onClose} />
                    </ThemedView>
                </ThemedView>
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

export default UpdateItemModal;
