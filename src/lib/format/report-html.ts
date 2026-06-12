// Mirrors "CCRS writing - format example.docx": Arial 11pt, color #262626,
// justified, bullets labeled a), b), c) with a 54pt left indent and 18pt
// hanging indent (1080/360 twips in the template), one blank line of spacing
// between paragraphs.
const PARAGRAPH_STYLE =
  "font-family: Arial, sans-serif; font-size: 11pt; color: #262626; text-align: justify; margin: 0 0 11pt 0;";
const BULLET_STYLE = `${PARAGRAPH_STYLE} margin-left: 54pt; text-indent: -18pt;`;

// Matches "a)", "b.", and legacy roman-numeral labels "i.", "ii)" etc.
const BULLET_LINE = /^([a-z][.)]|[ivxlcdm]+[.)])\s+/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Converts the plain-text report content into HTML that pastes into Word
 * with the firm's CSRP section formatting.
 */
export function reportContentToHtml(content: string): string {
  const paragraphs = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const style = BULLET_LINE.test(line) ? BULLET_STYLE : PARAGRAPH_STYLE;
      return `<p style="${style}">${escapeHtml(line)}</p>`;
    });

  return paragraphs.join("");
}
