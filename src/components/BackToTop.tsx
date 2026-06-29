import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/i18n';

/** Back-to-top control. JavaScript enhancement; hidden until scrolled. */
export function BackToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      className="fixed bottom-4 right-4 z-40 rounded-card bg-action px-4 py-2 text-sm font-medium text-surface shadow-md"
    >
      {t('backToTop')}
    </button>
  );
}
