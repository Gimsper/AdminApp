import QRcode from 'react-native-qrcode-svg'

import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'

import { TouchableOpacity, Alert, Platform } from 'react-native'

import * as FileSystem from 'expo-file-system';


declare global {
    var qrRef: any | undefined;
}

interface QRCodeModalProps {
    value: string
    isOpen: boolean;
    onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, value }) => {
    const isWeb = Platform.OS === 'web';

    const handleDownload = async () => {
        if (!global.qrRef) return;

        global.qrRef.toDataURL(async (dataURL: string) => {
            try {
                const base64Data = dataURL;
                const filename = `QR_${Date.now()}.png`;

                if (isWeb) {
                    const link = document.createElement('a');
                    link.href = `data:image/png;base64,${dataURL}`;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    const fileUri = `${FileSystem.documentDirectory}${filename}`;
                    
                    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    
                    Alert.alert('Éxito', `QR guardado en: ${fileUri}`);
                }

            } catch (error) {
                Alert.alert('Error', 'No se pudo guardar el QR');
                console.error('Error:', error);
            } finally {
                onClose();
            }
        });
    };

    if (!isOpen) return;

    return (
        <ThemedView
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <ThemedView
                style={{
                    backgroundColor: '#fff',
                    padding: 24,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <QRcode
                    value={value}
                    size={200}
                    getRef={(c) => (global.qrRef = c)}
                />
                <TouchableOpacity
                    style={{
                        marginTop: 16,
                        backgroundColor: '#007bff',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                    }}
                    onPress={handleDownload}
                >
                    <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Descargar QR</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}

export default QRCodeModal