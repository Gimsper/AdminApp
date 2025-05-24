import { Platform, StyleSheet, Button, ScrollView, FlatList } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Table, Rows, Row } from 'react-native-table-component'

import { useEffect, useState } from 'react';
import { getItems, deleteItem } from '@/actions/item';
import AddItemModal from '@/components/modals/AddItemModal';
import QRCodeModal from '@/components/modals/QRCodeModal';

import { Item } from '@/context/cart'
import { openBrowserAsync } from 'expo-web-browser';
import UpdateItemModal from '@/components/modals/UpdateItemModal';


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [items, setItems] = useState<any>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [QRCodeValue, setQRCodeValue] = useState("")
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

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

  const handleGenerateQR = (e: Item) => {
    setQRCodeValue(JSON.stringify(e));
    setShowQRModal(true);
  }

  const getItemsTableData = () => {
      if (!Array.isArray(items)) return [];

    return items.map((e: Item) => [
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
        <Button
          title="Generar QR"
          color="rgb(222, 176, 61)"
          onPress={() => handleGenerateQR(e)}
        />
      </View>
    ]);
  }

  return (
    <>
      <View style={{ display: 'flex', flex: 1, gap: 24, maxHeight: "90%", marginTop: "3%" }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Productos</ThemedText>
          <Button title='Agregar producto' color='rgb(39, 183, 31)' onPress={handleAddItem} />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ScrollView horizontal={Platform.OS !== 'web'}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.itemId.toString()}
              ListHeaderComponent={
                <View style={[styles.table, { flexDirection: 'row', backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}>
                  {['Id', 'Nombre', 'Categoría', 'Precio', 'Acciones'].map((header, idx) => (
                  <View key={idx} style={[styles.tableHeaders, { flex: 1 }]}>
                    <ThemedText style={{ color: colorScheme === "dark" ? "#fff" : "#000", textAlign: 'center' }}>{header}</ThemedText>
                  </View>
                  ))}
                </View>
              }
              renderItem={({ item }: { item: Item }) => (
                <View style={[styles.table, { flexDirection: 'row', backgroundColor: colorScheme === 'dark' ? '#222' : '#fafafa', alignItems: 'center' }]}>
                  <View style={[styles.tableCells, { flex: 1 }]}>
                    <ThemedText style={{ color: colorScheme === "dark" ? "#fff" : "#000", textAlign: 'center' }}>{item.itemId}</ThemedText>
                  </View>
                  <View style={[styles.tableCells, { flex: 1 }]}>
                    <ThemedText style={{ color: colorScheme === "dark" ? "#fff" : "#000", textAlign: 'center' }}>{item.name}</ThemedText>
                  </View>
                  <View style={[styles.tableCells, { flex: 1 }]}>
                    <ThemedText style={{ color: colorScheme === "dark" ? "#fff" : "#000", textAlign: 'center' }}>{item.categoryName}</ThemedText>
                  </View>
                  <View style={[styles.tableCells, { flex: 1 }]}>
                    <ThemedText style={{ color: colorScheme === "dark" ? "#fff" : "#000", textAlign: 'center' }}>{item.price}</ThemedText>
                  </View>
                  <View style={[styles.tableCells, { flex: 1, flexDirection: Platform.OS === 'web' ? 'row' : 'column', justifyContent: 'center', gap: 4 }]}>
                    <Button
                      title="Editar"
                      onPress={() => {
                        setItemToEdit(item);
                        setEditModalVisible(true);
                      }}
                    />
                    <Button
                      title="Eliminar"
                      color="red"
                      onPress={() => handleDeleteItem(item.itemId)}
                    />
                    <Button
                      title="Generar QR"
                      color="rgb(222, 176, 61)"
                      onPress={() => handleGenerateQR(item)}
                    />
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </ThemedView>
      </View>
      <AddItemModal
        isOpen={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onItemAdded={handleOnItemCreated}
      />
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        value={QRCodeValue}
      />
      <UpdateItemModal
        isOpen={editModalVisible}
        item={itemToEdit}
        onClose={() => {
          setEditModalVisible(false);
          setItemToEdit(null);
        }}
        onItemUpdated={(updatedItem) => {
          const updatedItems = items.map((item: any) =>
            item.itemId === updatedItem.itemId ? updatedItem : item
          );
          setItems(updatedItems);
          setEditModalVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  table: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  tableHeaders: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCells: {
    flex: 1,
    padding: 12,
    borderColor: '#ccc',
    justifyContent: 'center',
    minHeight: 40,
  },
});
