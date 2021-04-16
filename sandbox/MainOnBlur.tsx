import React, { useEffect, useState } from 'react';
import HydraIDE from '@/index';
import { Config } from './Config';
import { JsTheme } from './themes';
export const Main = () => {
  const [value, setValue] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <HydraIDE
      editorOptions={Config}
      theme={JsTheme}
      setValue={(v) => {}}
      setValueOnBlur={(v) => {
        setValue(v);
      }}
      value={value}
      depsToObserveForResize={[windowWidth]}
    />
  );
};
