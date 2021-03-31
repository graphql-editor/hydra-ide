import { Colors } from '../Colors';
import { editor } from 'monaco-editor';
import { darken, lighten, toHex } from 'color2k';

export const JsTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment.js', foreground: toHex(darken(Colors.grey, 0.5)) },
    { token: 'keyword.js', foreground: Colors.main },
    { token: 'number.js', foreground: Colors.green },
    { token: 'string.js', foreground: Colors.sky },
    { token: 'identifier.js', foreground: toHex(darken(Colors.sky, 0.21)) },
    {
      token: 'type.identifier.js',
      foreground: toHex(lighten(Colors.sky, 0.1)),
    },
  ],
  colors: {
    'editor.foreground': Colors.sky,
    'editor.background': toHex(darken(Colors.main, 0.63)),
    'minimap.background': toHex(darken(Colors.main, 0.64)),
  },
};
