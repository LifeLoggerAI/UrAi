import React, { type ReactNode } from 'react';

type ChipProps = {
  children?: ReactNode;
};

const Chip = ({ children }: ChipProps) => {
  return (
    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white">
      {children}
    </div>
  );
};

export default Chip;
