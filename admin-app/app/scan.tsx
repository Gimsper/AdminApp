import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

export default function QRCodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

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

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    setQrData(result.data);
    alert(`Código QR escaneado: ${result.data}`);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Escanear otro QR" onPress={() => {
          setScanned(false);
          setQrData(null);
        }} />
      )}
      {qrData && <Text style={styles.result}>Resultado: {qrData}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  result: { textAlign: 'center', padding: 10, fontSize: 16, backgroundColor: '#eee' }
});
