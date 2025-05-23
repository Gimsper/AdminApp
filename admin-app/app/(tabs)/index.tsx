import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useEffect, useState } from 'react';
import { getItems, deleteItem } from '@/actions/item';
import AddItemModal from '@/components/modals/AddItemModal';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [items, setItems] = useState<any>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await getItems();
      if (response.data) {
        setItems(response.data);
      }
    }
    fetchItems();
  }, []);

  const handleDeleteItem = async (itemId: any) => {
    const response = await deleteItem(itemId);
    if (!response.data) {
      const newItems = items.filter((item: any) => item.itemId !== itemId);
      setItems(newItems);
    }
  };

  const handleAddItem = () => {
    setAddModalVisible(true);
  }

  const handleOnItemCreated = (newItem: any) => {
    setItems([...items, newItem]);
    setAddModalVisible(false);
  }

  return (
    <>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 24 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Productos</ThemedText>
          <button
            onClick={() => handleAddItem()}
            style={{ backgroundColor: 'rgb(39, 183, 31)', color: 'white', padding: 8, borderRadius: 4, border: 'none', cursor: 'pointer' }}
          >
            Agregar producto
          </button>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <table style={{ ...styles.table, backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' }}>
            <thead>
              <tr style={{ backgroundColor: colorScheme === 'dark' ? '#666' : 'ddd', height: 40 }}>
                <th style={{ padding: 8 }}>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: any) => (
                <tr key={index} style={{ height: 60 }}>
                  <td style={{ padding: 8 }}>{item.itemId}</td>
                  <td>{item.name}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.price}$</td>
                  <td>
                    <button style={{ backgroundColor: 'rgb(74, 96, 242)', color: 'white', padding: 8, borderRadius: 4, border: 'none', cursor: 'pointer' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteItem(item.itemId)} style={{ backgroundColor: 'red', color: 'white', padding: 8, borderRadius: 4, marginLeft: 8, border: 'none', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ThemedView>
      </View>
      <AddItemModal
        isOpen={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onItemAdded={handleOnItemCreated}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    width: '100%',
    padding: 16,
  },
  table: {
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 8,
  }
});
