import { useState } from 'react';
import { Text, Button } from 'react-native';
import { useAuth } from '@/context/auth';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedInput';

import { StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';

import { loginUser } from '@/actions/user';

export default function Login() {
  const { setAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = async () => {
    const newErrors: typeof errors = {};
    if (!username) {
      newErrors.username = 'El usuario es requerido';
      setErrors(newErrors);
      return;
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      setErrors(newErrors);
      return;
    }
    
    const response = await loginUser({ username, password });
    console.log('response', response);
    if (!response.data) {
      newErrors.username = 'Usuario o contraseña incorrectos';
      setErrors(newErrors);
      return;
    }
    return response.data;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setAuthenticated(true);
    router.push('/(tabs)/products');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Iniciar sesión' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">¡Bienvenido!</ThemedText>
        <ThemedText type="subtitle">Ingrese sus credenciales</ThemedText>
        <ThemedView style={styles.formContainer}>
          <ThemedView style={styles.inputContainer}>
            <ThemedText>Nombre de usuario</ThemedText>
            <ThemedTextInput
              placeholder="Usuario"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedText>Contraseña</ThemedText>
            <ThemedTextInput
              placeholder="Contraseña"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </ThemedView>
          <Button title="Iniciar sesión" onPress={handleLogin} />
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 24,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: 20,
    width: '100%',
    maxWidth: 400,  
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    color: '#aaa',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
});