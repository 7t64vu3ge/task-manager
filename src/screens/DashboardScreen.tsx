import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { DashboardScreenProps } from '../types/navigation';

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Screen</Text>
      <Button 
        title="View Statistics" 
        onPress={() => navigation.navigate('Statistics')} 
      />
      <View style={styles.spacer} />
      <Button 
        title="Logout" 
        color="#e53935"
        onPress={() => navigation.replace('Login')} 
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
  spacer: {
    height: 10,
  },
});
