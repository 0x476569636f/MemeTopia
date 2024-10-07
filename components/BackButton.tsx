import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex flex-row">
      <Feather
        name="arrow-left"
        size={28}
        color={isDarkColorScheme ? COLORS.dark.primary : COLORS.black}
        onPress={onPress}
      />
    </View>
  );
};
