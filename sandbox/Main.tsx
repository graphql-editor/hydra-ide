import React, { useEffect, useState } from 'react';
import { initialValues } from './initial';
import HydraIDE from '@/index';
import { Config } from './Config';
import { JsTheme } from './themes';
export const Main = () => {
  const [value, setValue] = useState(initialValues.js);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <HydraIDE
      editorOptions={{
        ...Config,
      }}
      theme={JsTheme}
      setValue={setValue}
      value={value}
      depsToObserveForResize={[windowWidth]}
    />
  );
};
