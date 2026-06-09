import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { LoginScreenProps } from '../types/navigation';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button 
        title="Go to Dashboard" 
        onPress={() => navigation.navigate('Dashboard')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
