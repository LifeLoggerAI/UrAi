import Image from 'next/image';
import React from 'react';

const AvatarFallback = () => {
  return (
    <Image
      src="/path/to/fallback/avatar.png"
      alt="Fallback Avatar"
      width={96}
      height={96}
    />
  );
};

export default AvatarFallback;
