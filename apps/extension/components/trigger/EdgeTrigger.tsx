/**
 * EdgeTrigger - 边缘触发器组件
 * 在屏幕边缘显示一个触发区域，点击后展开书签面板
 */
import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@hamhome/ui';
import type { PanelPosition } from '@/types';

export interface EdgeTriggerProps {
  position: PanelPosition;
  visible: boolean;
  onClick: () => void;
}

export function EdgeTrigger({ position, visible, onClick }: EdgeTriggerProps) {
  const { t } = useTranslation('bookmark');
  
  return (
    <div
      // 内联 transform：Tailwind 的 translate 工具类依赖 document 级 @property 注册的
      // --tw-translate-*，被页面移除后整条声明失效（issue #13）
      style={{
        transform: visible
          ? 'translate(0, -50%)'
          : position === 'left'
            ? 'translate(-100%, -50%)'
            : 'translate(100%, -50%)',
      }}
      className={cn(
        'fixed top-1/2 z-[99998]',
        'transition-[transform,opacity,visibility] duration-300 ease-out',
        position === 'left' ? 'left-0' : 'right-0',
        visible
          ? 'visible pointer-events-auto opacity-100'
          : 'invisible pointer-events-none opacity-0'
      )}
    >
      <button
        onClick={onClick}
        className={cn(
          'flex items-center justify-center',
          'w-10 h-16',
          'bg-background/95 backdrop-blur-sm',
          'border border-border shadow-lg',
          'hover:bg-muted transition-colors',
          'cursor-pointer',
          position === 'left'
            ? 'rounded-r-lg border-l-0'
            : 'rounded-l-lg border-r-0'
        )}
        title={t('bookmark:contentPanel.openPanel')}
      >
        <Bookmark className="h-5 w-5 text-foreground" />
      </button>
    </div>
  );
}
