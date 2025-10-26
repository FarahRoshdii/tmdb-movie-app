import { MagnifyingGlassIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import type React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function SearchInput({ value, onChange, onClose, onKeyDown }: Props) {
  return (
    <div
      className="
        sticky top-0 z-10
        flex items-center gap-3
        p-4 border-b border-gray-800
        bg-[#0d0d0d]
      "
    >
      <button
        onClick={onClose}
        className="block sm:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
      </button>

      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 hidden sm:block" />

      <input
        type="text"
        placeholder="Search for a movie..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="
          flex-1 bg-transparent outline-none
          text-gray-100 placeholder-gray-500 text-base
        "
        autoFocus
      />

      <button
        onClick={onClose}
        className="hidden sm:block p-1 rounded-md hover:bg-gray-800 transition-colors"
      >
        <XMarkIcon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
