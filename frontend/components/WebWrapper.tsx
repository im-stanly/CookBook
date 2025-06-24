import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Platform } from 'react-native';
import WebNavigation from './WebNavigation';

interface WebWrapperProps {
  children: React.ReactNode;
}

const WebWrapper: React.FC<WebWrapperProps> = ({ children }) => {
  if (Platform.OS !== 'web') {
    // On mobile, return children without wrapper
    return <>{children}</>;
  }

  const screenHeight = Dimensions.get('window').height;
  return (
    <View style={[styles.webContainer, { minHeight: screenHeight }]}>
      <View style={[styles.appWrapper, { minHeight: screenHeight }]}>
          {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#151718', 
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  appWrapper: {
    width: '100%',
    maxWidth: 480, 
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default WebWrapper;
