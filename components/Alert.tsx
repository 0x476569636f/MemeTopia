import { Modal, View, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { Text } from './nativewindui/Text';

type AlertProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
};

const Alert: React.FC<AlertProps> = ({
  visible,
  onClose,
  title,
  message,
  actionText = 'Tutup',
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center">
        <View className="mx-4 w-11/12 max-w-md rounded-lg bg-card p-6">
          <Text variant="title2" className="mb-4">
            {title}
          </Text>
          <Text className="mb-6">{message}</Text>
          <TouchableOpacity className="rounded-md bg-blue-500 p-2" onPress={onClose}>
            <Text className="text-center text-white">{actionText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
