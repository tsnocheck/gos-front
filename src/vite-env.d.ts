/// <reference types="vite/client" />

declare module 'react-quill-new' {
  import * as React from 'react';

  export interface QuillOptions {
    modules?: Record<string, unknown>;
    formats?: string[];
    theme?: string;
    placeholder?: string;
  }

  export interface ReactQuillProps {
    id?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: unknown, source: string, editor: unknown) => void;
    onChangeSelection?: (range: unknown, source: string, editor: unknown) => void;
    onFocus?: (range: unknown, source: string, editor: unknown) => void;
    onBlur?: (previousRange: unknown, source: string, editor: unknown) => void;
    modules?: Record<string, unknown>;
    formats?: string[];
    theme?: string;
    placeholder?: string;
    readOnly?: boolean;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export class Quill {
    static register(
      path: string | Record<string, unknown>,
      target?: unknown,
      overwrite?: boolean,
    ): void;
    static import(path: string): unknown;
  }

  class ReactQuill extends React.Component<ReactQuillProps> {
    getEditor(): unknown;
    focus(): void;
    blur(): void;
  }

  export default ReactQuill;
  export { Quill };
}

declare module 'quill-resize-image' {
  import Quill from 'quill';
  interface ResizeModuleOptions {
    locale?: Record<string, string>;
  }
  class QuillResizeImage {
    constructor(quill: Quill, options?: ResizeModuleOptions);
  }
  export default QuillResizeImage;
}

declare module 'quill-table-better' {
  import Quill from 'quill';

  interface TableBetterOptions {
    language?: string;
    menus?: string[];
    toolbarTable?: boolean;
    toolbarButtons?: {
      whiteList?: string[];
      singleWhiteList?: string[];
    };
  }

  class QuillTableBetter {
    static keyboardBindings: Record<string, unknown>;
    constructor(quill: Quill, options?: TableBetterOptions);
    insertTable(rows: number, columns: number): void;
    deleteTable(): void;
    getTable(range?: unknown): [unknown, unknown, unknown, number] | null;
  }

  export default QuillTableBetter;
}