import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import * as monaco from 'monaco-editor';
import { EditorRestyle } from './styles/editor';
import { tree } from '@/cypressTree';

export interface HydraIDEProps {
  className?: string;
  style?: React.CSSProperties;
  editorOptions?: Omit<
    monaco.editor.IStandaloneEditorConstructionOptions,
    'theme'
  >;
  value: string;
  setValue: (value: string) => void;
  setValueOnBlur?: (value: string) => void;
  theme: monaco.editor.IStandaloneThemeData;
  depsToObserveForResize?: React.DependencyList;
  onMonaco?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

let blockEditorFromSettingValue = false;

const HydraIDE = ({
  className = '',
  editorOptions,
  theme,
  setValue,
  style = {},
  value,
  depsToObserveForResize = [],
  onMonaco,
  setValueOnBlur,
}: HydraIDEProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();

  const [monacoSubscription, setMonacoSubscription] = useState<
    monaco.IDisposable
  >();

  const [monacoBlurSubscription, setMonacoBlurSubscription] = useState<
    monaco.IDisposable
  >();

  useLayoutEffect(() => {
    monacoInstance?.layout();
  }, depsToObserveForResize);

  useEffect(() => {
    const m = monacoInstance?.getModel();
    if (m && value !== m.getValue()) {
      blockEditorFromSettingValue = true;
      monacoInstance?.pushUndoStop();
      m.pushEditOperations(
        [],
        [
          {
            range: m.getFullModelRange(),
            text: value,
          },
        ],
        () => null,
      );
      blockEditorFromSettingValue = false;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      monacoInstance?.dispose();
    };
  }, [monacoInstance]);

  useEffect(() => {
    return () => {
      monacoSubscription?.dispose();
    };
  }, [monacoSubscription]);
  useEffect(() => {
    if (monacoInstance) {
      const subscription = monacoInstance.onDidChangeModelContent(() => {
        if (blockEditorFromSettingValue) {
          blockEditorFromSettingValue = false;
          return;
        }
        setValue(monacoInstance.getValue() || '');
      });
      setMonacoSubscription(subscription);
    }
  }, [setValue, monacoInstance]);

  useEffect(() => {
    return () => {
      monacoBlurSubscription?.dispose();
    };
  }, [monacoBlurSubscription]);

  useEffect(() => {
    if (monacoInstance && setValueOnBlur) {
      const subscription = monacoInstance.onDidBlurEditorText(() => {
        setValue(monacoInstance.getValue() || '');
      });
      setMonacoBlurSubscription(subscription);
    }
  }, [setValueOnBlur, monacoInstance]);

  useEffect(() => {
    monacoSubscription?.dispose();
    monacoInstance?.getModel()?.dispose();
    monacoInstance?.dispose();
    monaco.editor.defineTheme('theme', theme);
    const m = monaco.editor.create(ref.current!, {
      ...editorOptions,
      value,
      theme: 'theme',
    });
    m.layout();
    monaco.editor.remeasureFonts();
    const subscription = m.onDidChangeModelContent(() => {
      if (blockEditorFromSettingValue) {
        blockEditorFromSettingValue = false;
        return;
      }
      setValue(m.getModel()?.getValue() || '');
    });
    setMonacoInstance(m);
    onMonaco?.(m);
    setMonacoSubscription(subscription);
  }, [editorOptions, theme]);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...style,
        }}
        className={className}
        ref={ref}
        data-cy={tree.tree.code}
      ></div>
      <style>{EditorRestyle}</style>
    </>
  );
};
export default HydraIDE;
