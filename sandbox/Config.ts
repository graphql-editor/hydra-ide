import * as monaco from 'monaco-editor';

export const Config: monaco.editor.IStandaloneEditorConstructionOptions &
  Required<
    Pick<monaco.editor.IStandaloneEditorConstructionOptions, 'language'>
  > = {
  language: 'javascript',
};
