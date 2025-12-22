/// <reference types="vite/client" />

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
