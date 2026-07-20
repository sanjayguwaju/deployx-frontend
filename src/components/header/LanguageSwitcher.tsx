import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language === 'ne' ? 'NE' : 'EN';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 h-11 px-3.5 bg-white border border-gray-200 rounded-full text-sm text-gray-500 transition-colors hover:text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
        >
          <Globe size={18} className="text-current" />
          <span className="font-medium">{currentLang}</span>
          <ChevronDown size={16} className="text-current" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-32 flex flex-col rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-900"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <DropdownMenu.Item asChild>
                <button
                  onClick={() => handleLanguageChange('ne')}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors outline-none cursor-pointer focus:bg-gray-100 dark:focus:bg-white/10 ${
                    i18n.language === 'ne'
                      ? 'bg-gray-100 text-brand-500 font-medium dark:bg-white/10 dark:text-brand-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                  }`}
                >
                  नेपाली (NE)
                </button>
              </DropdownMenu.Item>
            </li>
            <li>
              <DropdownMenu.Item asChild>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors outline-none cursor-pointer focus:bg-gray-100 dark:focus:bg-white/10 ${
                    i18n.language === 'en'
                      ? 'bg-gray-100 text-brand-500 font-medium dark:bg-white/10 dark:text-brand-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                  }`}
                >
                  English (EN)
                </button>
              </DropdownMenu.Item>
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default LanguageSwitcher;
