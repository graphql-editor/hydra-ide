import React, { useState } from 'react';
import { initialValues } from './initial';
import HydraIDE from '@/index';
import { Config } from './Config';
import { JsTheme } from './themes';
export const Main = () => {
  const [value, setValue] = useState(initialValues.js);

  return (
    <HydraIDE
      editorOptions={{
        ...Config,
      }}
      theme={JsTheme}
      setValue={setValue}
      value={value}
    />
  );
};
