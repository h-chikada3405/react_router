import { useEffect, useState } from 'react';

/**
 * 画面幅とユーザーエージェントを使って、モバイルかどうかを判定
 *
 * @returns {boolean}
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const windowWidth = window.innerWidth;
      const isMobileUserAgent = /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/.test(
        navigator.userAgent.toLowerCase()
      );
      setIsMobile(windowWidth <= 768 || isMobileUserAgent);
    };
    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
