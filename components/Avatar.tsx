import React from 'react';
import { hp } from '~/lib/common';
import { Image } from 'expo-image';
import { getUserImageSrc } from '~/functions/user';

type AvatarProps = {
  uri: string;
  size?: number;
  style?: any;
};

const Avatar: React.FC<AvatarProps> = ({ uri, size = hp(4.5), style }) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...style,
      }}
    />
  );
};

export default Avatar;
