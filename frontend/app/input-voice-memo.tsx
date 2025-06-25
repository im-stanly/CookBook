import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets, RecordingStatus, AudioQuality, IOSOutputFormat } from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { CookButton } from '@/components/CookButton';
import { router } from "expo-router";
import { API_URL } from "@/constants/URLs";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useFoundIngredients } from "@/contexts/FoundIngredientsContext";

const recordingOptions: RecordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    android: {
        extension: '.wav',
        outputFormat: 'default',
        audioEncoder: 'default',
    },
       ios: {
        extension: '.wav',
        outputFormat: IOSOutputFormat.LINEARPCM,
        audioQuality: AudioQuality.MAX,  
        sampleRate: 44100,
    },
    web: {
        mimeType: 'audio/wav',
        bitsPerSecond: 128000,
    },
};

export default function InputVoiceMemo() {
    const colorScheme = useColorScheme();
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState<string>('');
    
    // Add this to access the found ingredients context
    const { setFoundIngredients } = useFoundIngredients();

    const recorder = useAudioRecorder(recordingOptions, (status: RecordingStatus) => {
        // Log the status to see what properties are available
        console.log("Recording status:", status);
    });

    const startRecording = async () => {
        try {
            console.log('Starting recording...');

            await recorder.prepareToRecordAsync();
            await recorder.record(); 
            setIsRecording(true);
            setDuration(0);
            
            console.log('Recording started successfully');
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Recording Error', `Failed to start recording: ${error.message}`);
            setIsRecording(false);
        }
    }

    const stopRecording = async () => {
        try {
            console.log('Stopping recording...');
            
            await recorder.stop();
            const uri = recorder.uri;
            setIsRecording(false);
            setRecordingUri(uri);
            
            console.log('Recording stopped successfully, URI:', uri);
        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Recording Error', `Failed to stop recording: ${error.message}`);
            setIsRecording(false);
        }
    };  

    const formatDuration = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    
    useEffect(() => {
        (async () => {
            const permissionResponse = await AudioModule.requestRecordingPermissionsAsync();
                if (permissionResponse.status !== 'granted') {
                    Alert.alert('Permission to access microphone was denied');
                }
        })();
    }, []);  

    useEffect(() => {
        let interval: number | null = null;
        
        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 100); 
            }, 100);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRecording]);

    const fetchRecording = async (uri: string) => {
        if (!uri) {
            Alert.alert('Error', 'No recording found to transcribe');
            return;
        }

        setIsTranscribing(true);
        
        try {
            console.log("Uploading recording from:", uri);
            
            const formData = new FormData();
            
            if (Platform.OS === 'web') {
                const fileResponse = await fetch(uri);
                const fileBlob = await fileResponse.blob();
                
                console.log("File blob type:", fileBlob.type);
                console.log("File blob size:", fileBlob.size);
                
                const audioBlob = new Blob([fileBlob], { type: 'audio/wav' });
                formData.append('file', audioBlob, 'recording.wav');
            } else {
                formData.append('file', {
                    uri: uri,
                    type: 'audio/wav',
                    name: 'recording.wav',
                } as any);
            }

            const response = await axios.post(`${API_URL}/recipe/audio`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
            });

            console.log("Transcription response:", response.data);
            
            if (response.data && response.data.ingredients) {
                setTranscription(response.data.ingredients);
                
                const ingredientsList = response.data.ingredients
                    .split(',')
                    .map((ingredient: string) => ingredient.trim())
                    .filter((ingredient: string) => ingredient.length > 0);
                
                const foundIngredients = ingredientsList.map((ingredient: string) => ({
                    input: ingredient,
                    unit: '', 
                    name: ingredient
                }));
                
                setFoundIngredients(foundIngredients);
                
                router.push('/found-ingredients');
            }
        } catch (error) {
            console.error('Transcription failed:', error);
        } finally {
            setIsTranscribing(false);
        }
    };

    const deleteRecording = () => {
        setRecordingUri(null);
        setDuration(0);
        setTranscription('');
    };

    return (
        <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <MaterialIcons 
                    name="mic" 
                    size={100} 
                    color={isRecording ? 'red' : (colorScheme === 'light' ? '#333' : '#fff')} 
                />
                
                {isRecording && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <ThemedText style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>
                            Recording...
                        </ThemedText>
                        <ThemedText style={{ fontSize: 16 }}>
                            {formatDuration(duration)}
                        </ThemedText>
                    </View>
                )}
                {recordingUri && !isRecording && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <ThemedText style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                            Recording complete! ({formatDuration(duration)})
                        </ThemedText>
                        
                        <TouchableOpacity
                            onPress={() => fetchRecording(recordingUri)}
                            disabled={isTranscribing}
                            style={{
                                backgroundColor: isTranscribing ? '#999' : '#2c2c2e',
                                borderRadius: 23,
                                padding: 15,
                                paddingHorizontal: 20,
                                marginBottom: 10,
                                marginTop: 20,
                            }}
                        >
                            <ThemedText style={{ color: 'white' }}>
                                {isTranscribing ? 'Transcribing...' : 'Get Ingredients'}
                            </ThemedText>
                        </TouchableOpacity>

                        {transcription && (
                            <View style={{ 
                                backgroundColor: colorScheme === 'light' ? '#2c2c2e' : '#2c2c2e', 
                                borderRadius: 10, 
                                padding: 10,
                                marginTop: 10,
                                maxWidth: '80%'
                            }}>
                                <ThemedText style={{ fontSize: 14, textAlign: 'center' }}>
                                    {transcription}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                )}

                
            </View>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 20, alignItems: 'center' }}>
                {/* Delete Button */}
                <TouchableOpacity
                    onPress={deleteRecording}
                    disabled={!recordingUri || isTranscribing}
                    style={{
                        backgroundColor: (recordingUri && !isTranscribing) ? '#ff4444' : '#2c2c2e',
                        borderRadius: 50,
                        padding: 20,
                        alignItems: 'center',
                        marginBottom: 15,
                        justifyContent: 'center',
                        opacity: (recordingUri && !isTranscribing) ? 1 : 0.5,
                    }}
                >
                    <MaterialIcons name="delete" size={30} color="white" /> 
                </TouchableOpacity>

                {/* Record/Stop Button */}
                {!isRecording ? (
                    <TouchableOpacity
                        onPress={startRecording}
                        disabled={isTranscribing}
                        style={{
                            backgroundColor: isTranscribing ? '#999' : '#2c2c2e',
                            borderRadius: 50,
                            padding: 20,
                            alignItems: 'center',
                            marginBottom: 15,
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name="fiber-manual-record" size={30} color="red" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={stopRecording}
                        style={{
                            backgroundColor: '#666',
                            borderRadius: 50,
                            padding: 20,
                            alignItems: 'center',
                            marginBottom: 15,
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name="stop" size={30} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </ThemedView>
    );
}