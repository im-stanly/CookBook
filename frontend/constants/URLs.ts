/* While testing on an expo app replace localhost with your computer's IP
    for example: http://192.168.100.129:8080 or http://192.168.0.92:8080*/

import { Platform } from 'react-native';

const getAPIURL = () => {
    if (__DEV__) {
        return "http://172.20.10.2:8080";
    } else {
        return process.env.EXPO_PUBLIC_API_URL || "http://172.20.10.2:8080";
    }
};

export const API_URL = "http://135.236.152.194:8080"; 
export const API_URL_AI = "http://135.236.152.194:8000"; 