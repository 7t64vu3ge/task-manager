import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatisticsScreenProps } from '../types/navigation';

export const StatisticsScreen = ({ navigation }: StatisticsScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics Screen</Text>
      <Button 
        title="Back to Dashboard" 
        onPress={() => navigation.goBack()} 
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
