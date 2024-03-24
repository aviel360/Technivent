import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { Sun } from 'react-bootstrap-icons';

function ColorScheme() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      <Sun />
    </ActionIcon>
  );
}

export default ColorScheme;