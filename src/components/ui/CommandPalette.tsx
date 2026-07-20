import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowRight, User, Settings, Users, LayoutDashboard, Building, MapPin } from "lucide-react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";

export const COMMAND_PALETTE_OPEN_EVENT = "open-command-palette";

interface CommandItem {
  id: string;
  name: string;
  route: string;
  icon: React.ReactNode;
  category: "Navigation" | "Actions";
}

const COMMANDS: CommandItem[] = [
  { id: "nav-dashboard", name: "Dashboard", route: "/", icon: <LayoutDashboard size={16} />, category: "Navigation" },
  { id: "nav-users", name: "Users", route: "/users", icon: <User size={16} />, category: "Navigation" },
  { id: "nav-citizens", name: "Citizens", route: "/citizens", icon: <Users size={16} />, category: "Navigation" },
  { id: "nav-wards", name: "Wards", route: "/wards", icon: <MapPin size={16} />, category: "Navigation" },
  { id: "nav-settings", name: "System Settings", route: "/system/settings", icon: <Settings size={16} />, category: "Navigation" },
  { id: "nav-branding", name: "Branding Settings", route: "/system/branding", icon: <Building size={16} />, category: "Navigation" },
  { id: "action-add-user", name: "Add New User", route: "/users?action=new", icon: <User size={16} />, category: "Actions" },
  { id: "action-add-citizen", name: "Add New Citizen", route: "/citizens?action=new", icon: <Users size={16} />, category: "Actions" },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, handleOpen);
    
    return () => {
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (command: CommandItem) => {
    navigate(command.route);
    setIsOpen(false);
  };

  // Group commands by category for rendering
  const categories = Array.from(new Set(COMMANDS.map(c => c.category)));

  return (
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
      label="Global Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
    >
      <Dialog.Overlay className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/60" />

      <Command
        className="relative z-50 w-full max-w-xl scale-100 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all dark:bg-gray-900 dark:ring-white/10 sm:rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]"
        loop
      >
        <div className="relative flex items-center border-b border-gray-100 px-4 dark:border-gray-800" cmdk-input-wrapper="">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <Command.Input
            className="h-14 w-full bg-transparent px-4 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500 sm:text-sm"
            placeholder="Search for pages, settings, or actions..."
          />
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">ESC</span>
            <span>to close</span>
          </div>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-smooth">
          <Command.Empty className="py-14 text-center text-sm text-gray-500 dark:text-gray-400">
            No results found.
          </Command.Empty>

          {categories.map(category => (
            <Command.Group 
              key={category} 
              heading={category}
              className="px-2 text-gray-700 dark:text-gray-300 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:dark:text-gray-400"
            >
              {COMMANDS.filter(c => c.category === category).map((cmd) => (
                <Command.Item
                  key={cmd.id}
                  value={cmd.name}
                  onSelect={() => handleSelect(cmd)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors data-[selected=true]:bg-brand-50 data-[selected=true]:text-brand-700 dark:data-[selected=true]:bg-brand-500/10 dark:data-[selected=true]:text-brand-400 text-gray-700 data-[selected=false]:hover:bg-gray-50 dark:text-gray-300 dark:data-[selected=false]:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-data-[selected=true]:bg-white group-data-[selected=true]:text-brand-600 group-data-[selected=true]:shadow-sm dark:bg-gray-800 dark:text-gray-400 dark:group-data-[selected=true]:bg-gray-800 dark:group-data-[selected=true]:text-brand-400">
                      {cmd.icon}
                    </div>
                    <span className="font-medium">{cmd.name}</span>
                  </div>
                  {/* Note: since cmdk renders active item via data-[selected=true], we can style based on that via Tailwind variants */}
                  <ArrowRight className="hidden h-4 w-4 opacity-50 group-data-[selected=true]:block" />
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/20 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 items-center justify-center rounded bg-gray-200 px-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                ↑
              </span>
              <span className="flex h-5 items-center justify-center rounded bg-gray-200 px-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                ↓
              </span>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 items-center justify-center rounded bg-gray-200 px-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                ↵
              </span>
              <span>to select</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-gray-400">
            PalikaOS Command Palette
          </div>
        </div>
      </Command>
    </Command.Dialog>
  );
};
