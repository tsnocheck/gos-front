import ReactQuill from 'react-quill';

const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed');

class TableBlot extends BlockEmbed {
  static blotName = 'table';
  static tagName = 'table';
  static className = 'ql-table';

  static create(value: any) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.innerHTML = value;
    }
    return node;
  }

  static value(node: HTMLElement) {
    return node.innerHTML;
  }
}

class TableRowBlot extends BlockEmbed {
  static blotName = 'table-row';
  static tagName = 'tr';
}

class TableCellBlot extends BlockEmbed {
  static blotName = 'table-cell';
  static tagName = 'td';
}

class TableHeaderBlot extends BlockEmbed {
  static blotName = 'table-header';
  static tagName = 'th';
}

class TableBodyBlot extends BlockEmbed {
  static blotName = 'table-body';
  static tagName = 'tbody';
}

class TableHeadBlot extends BlockEmbed {
  static blotName = 'table-head';
  static tagName = 'thead';
}

export function registerTableBlots() {
  Quill.register(TableBlot, true);
  Quill.register(TableRowBlot, true);
  Quill.register(TableCellBlot, true);
  Quill.register(TableHeaderBlot, true);
  Quill.register(TableBodyBlot, true);
  Quill.register(TableHeadBlot, true);
}
