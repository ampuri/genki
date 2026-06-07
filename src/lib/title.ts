export function stripTitlePlain(s: string): string {
  return s
    .replace(/^表現ノート\d+\.\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

export function stripTitleHtml(s: string): string {
  return s
    .replace(/^<ruby>表現<rt>ひょうげん<\/rt><\/ruby>ノート\d+\.\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

export function stripHonbunDialogue(html: string): string {
  return html.replace(/【[^】]+】/g, '').trim();
}
