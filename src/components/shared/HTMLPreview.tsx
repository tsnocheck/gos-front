import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { exportHTMLToPDF } from '@/utils/exportToPdf';

const { Text } = Typography;

interface HTMLPreviewProps {
  html: string;
  title?: string;
  filename?: string;
  showExportButton?: boolean;
  showPreviewButton?: boolean;
  onPreview?: () => void;
}

const HTMLPreview: React.FC<HTMLPreviewProps> = ({
  html,
  title = 'Предварительный просмотр',
  filename = 'document.pdf',
  showExportButton = true,
  showPreviewButton = true,
  onPreview,
}) => {
  const handleExport = () => {
    try {
      exportHTMLToPDF(html, filename, title);
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    }
  };

  if (!html || html.trim() === '') {
    return (
      <Card title={title}>
        <Text type="secondary">Контент не заполнен</Text>
      </Card>
    );
  }

  return (
    <Card 
      title={title}
      extra={
        <Space>
          {showPreviewButton && (
            <Button 
              icon={<EyeOutlined />} 
              onClick={handlePreview}
              size="small"
            >
              Просмотр
            </Button>
          )}
          {showExportButton && (
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              size="small"
              type="primary"
            >
              Экспорт PDF
            </Button>
          )}
        </Space>
      }
    >
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: '6px',
          padding: '16px',
          backgroundColor: '#fafafa',
          minHeight: '100px',
        }}
      />
    </Card>
  );
};

export default HTMLPreview;
