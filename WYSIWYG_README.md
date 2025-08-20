# WYSIWYG Редактор и Экспорт в PDF

## Обзор

В проекте реализован WYSIWYG редактор для следующих полей конструктора программы:

### Поля с WYSIWYG редактором:

1. **Форма аттестации**
   - Примеры заданий (новое поле)

2. **Список литературы**
   - Список основной литературы
   - Список дополнительной литературы
   - Электронные учебные материалы
   - Интернет-ресурсы

## Компоненты

### 1. WYSIWYGEditor
Основной компонент редактора на основе `react-quill`.

**Файл:** `src/components/shared/WYSIWYGEditor.tsx`

**Возможности:**
- Форматирование текста (жирный, курсив, подчеркнутый, зачеркнутый)
- Заголовки (H1-H3)
- Списки (нумерованные и маркированные)
- Отступы
- Выравнивание текста
- Ссылки
- Очистка форматирования

### 2. HTMLContent
Компонент для отображения HTML в PDF.

**Файл:** `src/components/pdf/shared/ui/HTMLContent.tsx`

**Поддерживаемые HTML теги:**
- `<h1>`, `<h2>`, `<h3>` - заголовки
- `<p>` - параграфы
- `<ul>`, `<ol>` - списки
- `<li>` - элементы списка
- `<strong>`, `<b>` - жирный текст
- `<em>`, `<i>` - курсив
- `<a>` - ссылки

### 3. HTMLPreview
Компонент для предварительного просмотра HTML с возможностью экспорта в PDF.

**Файл:** `src/components/shared/HTMLPreview.tsx`

**Функции:**
- Предварительный просмотр HTML
- Экспорт в PDF
- Кнопка просмотра

## Утилиты

### 1. htmlToPdf.ts
Утилиты для парсинга HTML и конвертации в структуру для PDF.

**Файл:** `src/utils/htmlToPdf.ts`

**Основные функции:**
- `parseHTMLToPDFStructure()` - парсинг HTML в структуру узлов
- `sanitizeHTML()` - очистка HTML от опасных тегов
- `extractTextFromNode()` - извлечение текста из узла
- Вспомогательные функции для проверки типов узлов

### 2. exportToPdf.ts
Утилиты для экспорта HTML в PDF.

**Файл:** `src/utils/exportToPdf.ts`

**Основные функции:**
- `exportHTMLToPDF()` - экспорт одной HTML страницы в PDF
- `exportMultipleHTMLToPDF()` - экспорт нескольких HTML страниц в PDF

## Использование

### Добавление WYSIWYG редактора в форму:

```tsx
import WYSIWYGEditor from '../shared/WYSIWYGEditor';

<WYSIWYGEditor
  name="fieldName"
  label="Название поля"
  placeholder="Введите текст..."
  rows={3}
  required={true}
/>
```

### Отображение HTML в PDF:

```tsx
import HTMLContent from '../../shared/ui/HTMLContent';

<HTMLContent html={program.fieldName || ''} />
```

### Предварительный просмотр с экспортом:

```tsx
import HTMLPreview from '../shared/HTMLPreview';

<HTMLPreview
  html={formData.fieldName}
  title="Название документа"
  filename="document.pdf"
  showExportButton={true}
  showPreviewButton={true}
/>
```

### Экспорт HTML в PDF программно:

```tsx
import { exportHTMLToPDF } from '@/utils/exportToPdf';

// Экспорт одной страницы
exportHTMLToPDF(htmlContent, 'filename.pdf', 'Заголовок');

// Экспорт нескольких страниц
exportMultipleHTMLToPDF([
  { html: html1, title: 'Страница 1' },
  { html: html2, title: 'Страница 2' }
], 'multipage.pdf');
```

## Обновленные страницы PDF

### 1. RegulatoryPage
Отображает нормативные документы с поддержкой HTML разметки.

### 2. LiteraturePage (новая)
Отображает все разделы литературы с поддержкой HTML разметки.

### 3. AttestationExamplesPage (новая)
Отображает примеры заданий аттестации с поддержкой HTML разметки.

## Безопасность

- Все HTML контент проходит санитизацию через `sanitizeHTML()`
- Удаляются потенциально опасные теги: `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`
- Поддерживаются только безопасные HTML теги для форматирования

## Зависимости

- `react-quill` - WYSIWYG редактор
- `htmlparser2` - парсинг HTML
- `jspdf` - создание PDF документов

## Примеры HTML разметки

### Заголовки:
```html
<h1>Главный заголовок</h1>
<h2>Подзаголовок</h2>
<h3>Мелкий заголовок</h3>
```

### Форматирование текста:
```html
<p><strong>Жирный текст</strong> и <em>курсив</em></p>
```

### Списки:
```html
<ul>
  <li>Элемент списка 1</li>
  <li>Элемент списка 2</li>
</ul>

<ol>
  <li>Нумерованный элемент 1</li>
  <li>Нумерованный элемент 2</li>
</ol>
```

### Ссылки:
```html
<p>Ссылка на <a href="https://example.com">сайт</a></p>
```
