import { ActivityIndicator, StyleSheet, View } from 'react-native';

type loadingProps = {
  size?: number | 'small' | 'large';
  color?: string;
};

const Loading: React.FC<loadingProps> = ({ size = 'large', color = '#FFFFFF' }) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
