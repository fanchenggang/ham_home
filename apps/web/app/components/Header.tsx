'use client';

import * as React from 'react';
import Image from 'next/image';
import { Sun, Moon, Languages, Github, Download, ChevronDown, Package } from 'lucide-react';
import {
  Button,
  Switch,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hamhome/ui';
import chromeIcon from './icon/chrome.svg';
import edgeIcon from './icon/edge.svg';
import firefoxIcon from './icon/firefox.svg';
import {
  getDownloadChannels,
  getRecommendedDownloadChannel,
  openDownloadUrl,
  resolveDownloadUrl,
  type DownloadChannel,
  type DownloadChannelId,
} from '@/app/lib/download';

interface HeaderProps {
  isDark: boolean;
  isEn: boolean;
  onToggleTheme: (e?: React.MouseEvent) => void;
  onToggleLanguage: () => void;
}

function renderChannelIcon(channelId: DownloadChannelId) {
  switch (channelId) {
    case 'chrome':
      return <Image src={chromeIcon} alt="Chrome" width={16} height={16} />;
    case 'edge':
      return <Image src={edgeIcon} alt="Edge" width={16} height={16} />;
    case 'firefox':
      return <Image src={firefoxIcon} alt="Firefox" width={16} height={16} />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

function DownloadDropdown({ isEn }: { isEn: boolean }) {
  const channels = getDownloadChannels();
  const recommendedChannel = getRecommendedDownloadChannel(channels);

  const handleDownload = (channel: DownloadChannel) => {
    openDownloadUrl(resolveDownloadUrl(channel));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="gap-1.5 px-2 sm:gap-2 sm:px-3">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{isEn ? 'Download' : '下载'}</span>
          <ChevronDown className="hidden h-3 w-3 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {channels.map((channel) => {
          const isRecommended = channel.id === recommendedChannel.id;
          return (
            <DropdownMenuItem
              key={channel.id}
              onClick={() => handleDownload(channel)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {renderChannelIcon(channel.id)}
                <span>{isEn ? channel.label.en : channel.label.zh}</span>
              </div>
              <div className="flex items-center gap-1">
                {isRecommended && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {isEn ? 'Recommended' : '推荐'}
                  </span>
                )}
                {!channel.published && (
                  <span className="text-xs text-muted-foreground">
                    {isEn ? 'Coming Soon' : '待发布'}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ isDark, isEn, onToggleTheme, onToggleLanguage }: HeaderProps) {
  // 用于存储主题切换区域的点击位置
  const themeToggleClickRef = React.useRef<{ x: number; y: number } | null>(null);
  const themeToggleRef = React.useRef<HTMLDivElement>(null);

  // 使用 onPointerDown 捕获点击位置（在 onCheckedChange 之前触发）
  const handleThemeTogglePointerDown = (e: React.PointerEvent) => {
    themeToggleClickRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleThemeToggle = () => {
    const clickPos = themeToggleClickRef.current;
    // 创建一个合成事件对象传递点击位置
    const syntheticEvent = {
      clientX: clickPos?.x ?? window.innerWidth / 2,
      clientY: clickPos?.y ?? window.innerHeight / 2,
    } as React.MouseEvent;
    onToggleTheme(syntheticEvent);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 min-w-0 items-center justify-between gap-2 px-3 sm:px-4">
        {/* Logo + 品牌 */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon/128.png`}
            alt="HamHome Logo"
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10"
          />
          <div className="min-w-0">
            <span className="block truncate text-lg font-bold sm:text-xl">HamHome</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {isEn ? 'AI Browser Workspace' : 'AI 浏览器工作台'}
            </span>
          </div>
        </div>

        {/* 右侧操作 */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">


          {/* 语言切换 */}
          <Button variant="ghost" size="sm" onClick={onToggleLanguage} className="gap-1 px-2 sm:gap-2 sm:px-3">
            <Languages className="h-4 w-4" />
            {isEn ? '中文' : 'EN'}
          </Button>

          {/* 主题切换 */}
          <div
            ref={themeToggleRef}
            className="flex items-center gap-1 sm:gap-2"
            onPointerDown={handleThemeTogglePointerDown}
          >
            <Sun className="hidden h-4 w-4 text-muted-foreground sm:block" />
            <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
            <Moon className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </div>

          {/* GitHub 入口 */}
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <a
              href="https://github.com/bingoYB/ham_home"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          {/* 下载入口 */}
          <DownloadDropdown isEn={isEn} />


        </div>
      </div>
    </header>
  );
}
