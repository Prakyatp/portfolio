'use client';
import { useRef, useState } from 'react';
import { site } from '@/data/site';

export function CopyEmail() {
  const [label, setLabel] = useState('Copy');
  const address = useRef<HTMLSpanElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setLabel('Copied');
    } catch {
      const node = address.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setLabel('Select it');
    }
    setTimeout(() => setLabel('Copy'), 1800);
  }

  return (
    <span className="contact__email">
      <a className="contact__address" href={`mailto:${site.email}`}>
        <span ref={address}>{site.email}</span>
      </a>
      <button className="copy" type="button" onClick={copy}>
        {label}
        <span className="sr-only"> email address</span>
      </button>
    </span>
  );
}
