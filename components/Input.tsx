import React from 'react';
import { View, TextInput, useColorScheme } from 'react-native';

type inputProps = {
  containerStyle?: string;
  icon?: React.ReactNode;
  inputRef?: React.RefObject<TextInput>;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
  value?: string;
};

const Input: React.FC<inputProps> = (props) => {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  return (
    <View
      className={`h-12 flex-row items-center gap-2 rounded-md border border-gray-400 px-4 ${props.containerStyle}`}>
      {props.icon && props.icon}
      <TextInput
        className="flex-1 text-black dark:text-white"
        placeholderTextColor={isDarkColorScheme ? 'white' : 'black'}
        ref={props.inputRef}
        value={props.value}
        {...props}
      />
    </View>
  );
};

export default Input;
