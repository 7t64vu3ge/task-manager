import React, { useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      stroke="#9ca3af"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const ClearIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke="#9ca3af"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search tasks...',
}) => {
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(badgeOpacity, {
      toValue: value.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, badgeOpacity]);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconLeft}>
          <SearchIcon />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ClearIcon />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={[styles.badgeContainer, { opacity: badgeOpacity }]}>
        <Text style={styles.badgeText}>✦ Smart Search — synonyms & typos supported</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 46,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
  badgeContainer: {
    marginTop: 5,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
