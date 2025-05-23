import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useShoppingCart } from '@/context/cart';
import { router } from 'expo-router';

export default function QRCodeScanner() {
  const { isScanning, setIsScanning, addToShoppingCart, setQrData } = useShoppingCart();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <Text>Verificando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Se requiere permiso para acceder a la cámara</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (!isScanning) {
      setIsScanning(true);
      setQrData(result.data);
      addToShoppingCart(result.data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={isScanning ? undefined : handleBarCodeScanned}
      />
      {isScanning && (
        <>
          <Button title="Escanear otro QR" onPress={() => {
            setIsScanning(false);
            setQrData(null);
          }} />
          <Button title="Ir al carrito" onPress={() => {
            setQrData(null);
            router.push('/shoppingcar')
          }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  result: { textAlign: 'center', padding: 10, fontSize: 16, backgroundColor: '#eee' }
});
