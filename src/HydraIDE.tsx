import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { EditorRestyle } from './styles/editor';

export interface HydraIDEProps {
  className?: string;
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
}

const HydraIDE = ({
  className = '',
  editorOptions,
  theme,
  setValue,
  value,
}: HydraIDEProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();
  const [monacoSubscription, setMonacoSubscription] = useState<
    monaco.IDisposable
  >();

  useEffect(() => {
    monacoInstance?.setValue(value);
  }, []);
  useEffect(() => {
    return () => {
      monacoInstance?.dispose();
      monacoSubscription?.dispose();
    };
  }, [monacoInstance, monacoSubscription]);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => document.removeEventListener('keydown', keyListener);
  }, []);

  useEffect(() => {
    resetEditor();
  }, []);

  const resetEditor = () => {
    monaco.editor.defineTheme('theme', theme);
    const m = monaco.editor.create(ref.current!, {
      ...editorOptions,
      value,
      theme: 'theme',
    });
    monaco.editor.remeasureFonts();
    monacoSubscription?.dispose();
    monacoInstance?.getModel()?.dispose();
    monacoInstance?.dispose();
    const subscription = m.onDidChangeModelContent(() => {
      const model = m.getModel();
      if (model) {
        const modelValue = model.getValue();
        if (modelValue) {
          setValue(modelValue);
        }
      }
    });
    setMonacoInstance(m);
    setMonacoSubscription(subscription);
  };

  return (
    <>
      <div className={className} ref={ref}></div>
      <style>{EditorRestyle}</style>
    </>
  );
};
export default HydraIDE;
