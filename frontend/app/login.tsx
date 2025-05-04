import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authState, onLogin, onRegister } = useAuth();

    const colorScheme = useColorScheme();

    const handleLogin = async () => {
        console.log('Login button pressed');
        const response = await onLogin!(username, password, '');
        if (response && response.error) {
            alert(response.msg);
        } else {
            alert('Login successful!');
            router.replace('/(tabs)');
        }

        console.log('Login response:', response);
    };

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <TextInput 
                style={[styles.input, {backgroundColor: colorScheme === 'light' ? '#222' : '#222'}]} 
                placeholder="Username" 
                onChangeText={(text: string) => setUsername(text)}
                placeholderTextColor="#aaa" 
            />
            <TextInput 
                style={[styles.input, {backgroundColor: colorScheme === 'light' ? '#222' : '#222'}]} 
                placeholder="Password" 
                onChangeText={(text: string) => setPassword(text)} 
                placeholderTextColor="#aaa"
                secureTextEntry={true}
            />
            
            <TouchableOpacity onPress={handleLogin}>
                <ThemedText style={[styles.primaryButton, {backgroundColor: colorScheme === 'light' ? '#222' : '#222'}]}>
                    Log in
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
                <ThemedText style={styles.secondaryButton}>
                    Create new account
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        color: '#fff',
        padding: 20,
        borderWidth: 0,
        borderRadius: 18,
        marginTop: 15,
    },
    primaryButton: {
        borderWidth: 0,
        borderRadius: 50,
        width: '100%',
        color: '#fff',
        textAlign: 'center',
        marginTop: 40,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 15,
    },
    secondaryButton: {
        opacity: 0.5,
        borderWidth: 0,
        borderRadius: 50,
        width: '100%',
        textAlign: 'center',
        fontSize: 15,
        marginTop: 3,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 15,
    },
});