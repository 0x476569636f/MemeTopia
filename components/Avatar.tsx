import React from 'react';
import { hp } from '~/lib/common';
import { Image } from 'expo-image';
import { getUserImageSrc } from '~/functions/user';
import { useColorScheme } from '~/lib/useColorScheme';

type AvatarProps = {
  uri: string;
  size?: number;
  style?: any;
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({ uri, size = hp(4.5), style, className }) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={{
        width: size,
        height: size,
        borderWidth: 0.5,
        borderColor: isDarkColorScheme ? '#FFFFFF' : '#000000',
        borderRadius: 25,
        ...style,
      }}
      className={className}
    />
  );
};

export default Avatar;
