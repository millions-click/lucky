import { useState, useEffect } from 'react';

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState('default');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= screens.lg) {
        setScreenSize('lg');
      } else if (width >= screens.md) {
        setScreenSize('md');
      } else {
        setScreenSize('sm');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
