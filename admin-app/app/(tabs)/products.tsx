import { Platform, StyleSheet, Button, ScrollView, FlatList } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Table, Rows, Row } from 'react-native-table-component'

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

  const getItemsTableData = () => {
      if (!Array.isArray(items)) return [];

    return items.map((e) => [
      e.itemId,
      e.name,
      e.categoryName,
      e.price,
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Editar"
        />
        <Button
          title="Eliminar"
          color="red"
          onPress={() => handleDeleteItem(e.itemId)}
        />
      </View>
    ]);
  }

  return (
    <>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 24 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Productos</ThemedText>
          <Button title='Agregar producto' color='rgb(39, 183, 31)' onPress={handleAddItem} />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Table style={{ ...styles.table, backgroundColor: colorScheme === 'dark' ? '#333' : '#fff'}}>
              <Row
                data={['Id', 'Nombre', 'Categoría', 'Precio', 'Acciones' ]}
                textStyle={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                style={styles.tableHeaders}
                flexArr={[1, 1, 1, 1, 1]}
                />
              <Rows
                data={getItemsTableData()}
                textStyle={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                style={styles.tableCells}
                flexArr={[1, 1, 1, 1, 1]}
              />
            </Table>
          </ScrollView>
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
  scrollContainer: {
    flex: 1,
    marginHorizontal: 15,
    maxHeight: 400
  },
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
  },
  tableHeaders: {
    padding: 12,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    textAlign: "center"
  },
  tableCells: {
    padding: 6,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    textAlign: "center"
  }
});
