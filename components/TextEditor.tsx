import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

interface TextEditorProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const TextEditor = React.forwardRef<TextInput, TextEditorProps>(
  ({ value, onChangeText, placeholder, style, ...props }, ref) => {
    const { isDarkColorScheme } = useColorScheme();
    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkColorScheme ? '#ccc' : '#666'}
          multiline
          numberOfLines={4}
          style={styles.input}
          textAlignVertical="top"
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'rgb(0, 123, 254)',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'transparent',
  },
  input: {
    minHeight: 100,
    maxHeight: 130,
    fontSize: 16,
  },
});

export default TextEditor;
