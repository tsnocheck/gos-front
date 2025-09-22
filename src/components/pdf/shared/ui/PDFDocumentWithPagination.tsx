import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { ReactElement } from 'react';

interface PDFDocumentWithPaginationProps {
  children: ReactElement[];
  title?: string;
}

export const PDFDocumentWithPagination: React.FC<PDFDocumentWithPaginationProps> = ({
  children,
  title,
}) => {
  const totalPages = React.Children.count(children);

  const childrenWithPageNumbers = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, {
        pageNumber: index + 1,
        totalPages,
      });
    }
    return child;
  });

  return <Document title={title}>{childrenWithPageNumbers}</Document>;
};
