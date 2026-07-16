// Функция для копирования QR-кода как изображения с рамкой
export const copyQRCodeAsImage = async (elementId, qrValue, size = 240) => {
  try {
    // Сначала пытаемся скопировать HTML элемент с рамкой
    const element = document.getElementById(elementId);
    if (element) {
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Проверяем поддержку clipboard API
      if (navigator.clipboard && window.ClipboardItem) {
        return new Promise((resolve, reject) => {
          canvas.toBlob(async (blob) => {
            try {
              if (blob) {
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([clipboardItem]);
                resolve(true);
              } else {
                reject(new Error('Не удалось создать изображение'));
              }
            } catch (error) {
              reject(error);
            }
          }, 'image/png');
        });
      }
    }
    
    // Fallback - создаем QR-код без рамки
    const canvas = document.createElement('canvas');
    const QRCode = await import('qrcode');
    
    await QRCode.toCanvas(canvas, qrValue, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    if (navigator.clipboard && window.ClipboardItem) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          try {
            if (blob) {
              const clipboardItem = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([clipboardItem]);
              resolve(true);
            } else {
              reject(new Error('Не удалось создать изображение'));
            }
          } catch (error) {
            reject(error);
          }
        }, 'image/png');
      });
    } else {
      throw new Error('Копирование изображений не поддерживается в этом браузере');
    }
  } catch (error) {
    console.error('Ошибка при копировании QR-кода:', error);
    throw error;
  }
};

// Функция для скачивания QR-кода как изображения
export const downloadQRCodeAsImage = async (qrValue, filename = 'qr-code.png', size = 240) => {
  try {
    const canvas = document.createElement('canvas');
    const QRCode = await import('qrcode');
    
    await QRCode.toCanvas(canvas, qrValue, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
    
    return true;
  } catch (error) {
    console.error('Ошибка при скачивании QR-кода:', error);
    throw error;
  }
};