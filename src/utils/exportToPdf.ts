import { jsPDF } from 'jspdf';
import { sanitizeHTML, parseHTMLToPDFStructure, type HTMLNode } from './htmlToPdf';

/**
 * Конвертирует HTML в PDF и скачивает файл
 */
export function exportHTMLToPDF(
  html: string, 
  filename: string = 'document.pdf',
  title?: string
): void {
  if (!html || html.trim() === '') {
    console.warn('HTML контент пуст');
    return;
  }

  try {
    const doc = new jsPDF();
    const sanitizedHTML = sanitizeHTML(html);
    const nodes = parseHTMLToPDFStructure(sanitizedHTML);
    
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Добавляем заголовок если указан
    if (title) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 15;
    }
    
    // Обрабатываем HTML узлы
    nodes.forEach((node) => {
      yPosition = processNode(doc, node, yPosition, margin, lineHeight, pageHeight);
      
      // Проверяем, нужна ли новая страница
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Сохраняем PDF
    doc.save(filename);
    
  } catch (error) {
    console.error('Ошибка при создании PDF:', error);
    throw new Error('Не удалось создать PDF документ');
  }
}

/**
 * Обрабатывает HTML узел и добавляет его содержимое в PDF
 */
function processNode(
  doc: jsPDF, 
  node: HTMLNode, 
  yPosition: number, 
  margin: number, 
  lineHeight: number,
  pageHeight: number
): number {
  // Текстовый узел
  if (node.type === 'text' && node.data) {
    const text = node.data.trim();
    if (text) {
      const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin);
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    }
    return yPosition;
  }
  
  // Заголовок
  if (node.type === 'tag' && /^h[1-6]$/.test(node.name || '')) {
    const level = parseInt((node.name || 'h1').substring(1));
    const fontSize = Math.max(12 - level, 8);
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += 5;
    
    if (node.children) {
      node.children.forEach((child) => {
        yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
      });
    }
    
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    return yPosition;
  }
  
  // Список
  if (node.type === 'tag' && (node.name === 'ul' || node.name === 'ol')) {
    if (node.children) {
      node.children.forEach((child, index) => {
        if (child.type === 'tag' && child.name === 'li') {
          const bullet = node.name === 'ol' ? `${index + 1}.` : '•';
          
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(bullet, margin, yPosition);
          
          if (child.children) {
            child.children.forEach((grandChild) => {
              yPosition = processNode(doc, grandChild, yPosition, margin + 10, lineHeight, pageHeight);
            });
            yPosition += lineHeight;
          }
        }
      });
    }
    return yPosition;
  }
  
  // Параграф
  if (node.type === 'tag' && node.name === 'p') {
    yPosition += 3;
    
    if (node.children) {
      node.children.forEach((child) => {
        yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
      });
    }
    
    yPosition += 5;
    return yPosition;
  }
  
  // Жирный текст
  if (node.type === 'tag' && (node.name === 'strong' || node.name === 'b')) {
    doc.setFont('helvetica', 'bold');
    
    if (node.children) {
      node.children.forEach((child) => {
        yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
      });
    }
    
    doc.setFont('helvetica', 'normal');
    return yPosition;
  }
  
  // Курсив
  if (node.type === 'tag' && (node.name === 'em' || node.name === 'i')) {
    doc.setFont('helvetica', 'italic');
    
    if (node.children) {
      node.children.forEach((child) => {
        yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
      });
    }
    
    doc.setFont('helvetica', 'normal');
    return yPosition;
  }
  
  // Ссылка
  if (node.type === 'tag' && node.name === 'a') {
    doc.setTextColor(0, 0, 255);
    
    if (node.children) {
      node.children.forEach((child) => {
        yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
      });
    }
    
    doc.setTextColor(0, 0, 0);
    return yPosition;
  }
  
  // Обычный тег с детьми
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      yPosition = processNode(doc, child, yPosition, margin, lineHeight, pageHeight);
    });
  }
  
  return yPosition;
}

/**
 * Создает PDF из массива HTML строк (для создания многостраничного документа)
 */
export function exportMultipleHTMLToPDF(
  htmlPages: Array<{ html: string; title?: string }>,
  filename: string = 'document.pdf'
): void {
  if (!htmlPages || htmlPages.length === 0) {
    console.warn('Нет HTML страниц для экспорта');
    return;
  }

  try {
    const doc = new jsPDF();
    
    htmlPages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        doc.addPage();
      }
      
      const sanitizedHTML = sanitizeHTML(page.html);
      const nodes = parseHTMLToPDFStructure(sanitizedHTML);
      
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      
      // Добавляем заголовок страницы
      if (page.title) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(page.title, margin, yPosition);
        yPosition += 15;
      }
      
      // Обрабатываем HTML узлы
      nodes.forEach((node) => {
        yPosition = processNode(doc, node, yPosition, margin, lineHeight, pageHeight);
        
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
        }
      });
    });
    
    doc.save(filename);
    
  } catch (error) {
    console.error('Ошибка при создании многостраничного PDF:', error);
    throw new Error('Не удалось создать многостраничный PDF документ');
  }
}
