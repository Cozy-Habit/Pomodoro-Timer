import { addons } from '@storybook/manager-api';

import pomodoroTimerTheme from './pomodoroTimerTheme';

addons.setConfig({
  theme: pomodoroTimerTheme,
});
