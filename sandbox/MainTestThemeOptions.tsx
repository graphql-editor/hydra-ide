import React, { useEffect, useState } from 'react';
import HydraIDE from '@/index';
import { Config } from './Config';
import { CssTheme, JsTheme } from './themes';
import { initialValues } from '@/../sandbox/initial';
export const Main = () => {
  const [value, setValue] = useState(initialValues.js);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentTheme, setCurrentTheme] = useState(JsTheme);
  const [currentConfig, setCurrentConfig] = useState(Config);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setValue('body{ margin:0 }');
      setCurrentConfig({
        language: 'css',
        fixedOverflowWidgets: true,
        parameterHints: {
          enabled: true,
        },
      });
    }, 2000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setCurrentTheme(CssTheme);
    }, 5000);
  }, []);

  return (
    <HydraIDE
      editorOptions={currentConfig}
      theme={currentTheme}
      setValue={(v) => {
        console.log('Setting', v);
        setValue(v);
      }}
      value={value}
      depsToObserveForResize={[windowWidth]}
    />
  );
};
