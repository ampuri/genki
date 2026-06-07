import React from 'react';

interface HtmlProps {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Html({ html, className, as: Tag = 'span' }: HtmlProps) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
