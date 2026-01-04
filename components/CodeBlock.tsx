import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Icon } from './Icon';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#1e1e1e] border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">sketch.ino</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-600 rounded transition-colors"
        >
          <Icon icon={copied ? Check : Copy} size={14} />
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-[#d4d4d4]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
