import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Pressable, DimensionValue } from 'react-native';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Sizes } from '@/constants/Add-button-sizes';

const BTN_SIZE = Sizes.BTN_SIZE;
const MINI_BTN_SIZE = Sizes.MINI_BTN_SIZE;
const BTN_SPACING = Sizes.BTN_SPACING;
const INITIAL_SPACING = Sizes.INITIAL_SPACING;
const BTN_BOTTOM_OFFSET = Sizes.ADDBTN_BOTTOM_OFFSET as DimensionValue;
const BTN_RIGHT_OFFSET = Sizes.ADDBTN_RIGHT_OFFSET as DimensionValue;

export default function AddActionModal() {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animation, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, [animation]);

    const handleClose = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start(() => {
            if (router.canGoBack()) {
                router.back();
            }
        });
    };

    const getTransformStyle = (index: number) => ({
        transform: [{ scale: animation },
        {
            translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -(INITIAL_SPACING + BTN_SPACING * index)],
            }),
        },
        ],
        opacity: animation,
    });

    return (
        <View style={styles.container}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            </Pressable>

            {/* TODO: Create Search page, camera input page, voice input page */}
            <View style={styles.buttonContainer}>
                <Animated.View style={[styles.button, getTransformStyle(2)]}>
                    <TouchableOpacity onPress={() => { 
                                        // handleClose();
                                        router.replace('/search-ingredients-new'); 
                                    }} style={styles.miniButton}>
                        <MaterialIcons name="search" size={24} color="#333" />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.button, getTransformStyle(1)]}>
                    <TouchableOpacity onPress={() => console.log("Camera pressed")} style={styles.miniButton}>
                        <MaterialIcons name="photo-camera" size={24} color="#333" />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.button, getTransformStyle(0)]}>
                    <TouchableOpacity onPress={() => console.log("Microphone pressed")} style={styles.miniButton}>
                        <MaterialIcons name="mic" size={24} color="#333" />
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={handleClose} style={styles.mainButton}>
                    <Animated.View style={{
                        transform: [{
                            rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '45deg'],
                            })
                        }]
                    }}>
                        <MaterialIcons name="add" size={28} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: BTN_BOTTOM_OFFSET,
        right: BTN_RIGHT_OFFSET,
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: (BTN_SIZE - MINI_BTN_SIZE) / 2,
    },
    mainButton: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        borderRadius: BTN_SIZE / 2,
        backgroundColor: '#2C2C2E', // Dark color
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    miniButton: {
        width: MINI_BTN_SIZE,
        height: MINI_BTN_SIZE,
        borderRadius: MINI_BTN_SIZE / 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});