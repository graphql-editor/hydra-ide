import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import * as monaco from 'monaco-editor';
import { EditorRestyle } from './styles/editor';
import { tree } from '@/cypressTree';

export interface HydraIDEProps {
  className?: string;
  style?: React.CSSProperties;
  editorOptions?: monaco.editor.IStandaloneEditorConstructionOptions &
    Omit<
      Required<
        Pick<monaco.editor.IStandaloneEditorConstructionOptions, 'language'>
      >,
      'theme'
    >;
  value: string;
  setValue: (value: string) => void;
  theme: monaco.editor.IStandaloneThemeData;
  depsToObserveForResize?: React.DependencyList;
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
}: HydraIDEProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();

  const [monacoSubscription, setMonacoSubscription] = useState<
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
      monacoSubscription?.dispose();
    };
  }, [monacoInstance, monacoSubscription]);

  useEffect(() => {
    monaco.editor.defineTheme('theme', theme);
    monacoInstance?.updateOptions({ theme: 'theme' });
  }, [theme]);

  useEffect(() => {
    if (editorOptions) {
      monacoInstance?.updateOptions(editorOptions);
    }
  }, [editorOptions]);

  useEffect(() => {
    monaco.editor.defineTheme('theme', theme);
    const m = monaco.editor.create(ref.current!, {
      ...editorOptions,
      value,
      theme: 'theme',
    });
    m.layout();
    monaco.editor.remeasureFonts();
    monacoSubscription?.dispose();
    monacoInstance?.getModel()?.dispose();
    monacoInstance?.dispose();
    const subscription = m.onDidChangeModelContent(() => {
      if (blockEditorFromSettingValue) {
        blockEditorFromSettingValue = false;
        return;
      }
      setValue(m.getModel()?.getValue() || '');
    });
    setMonacoInstance(m);
    setMonacoSubscription(subscription);
  }, []);

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
