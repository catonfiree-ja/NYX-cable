/**
 * Decode HTML entities from CMS (WordPress imported) text
 * Used across product pages, category pages, and listing cards
 */
export function decodeHtmlEntities(text: string): string {
    if (!text) return ''
    return text
        .replace(/&#8230;/g, '…')
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&#8216;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\[&#8230;\]/g, '…')
        .replace(/\[…\]/g, '…')
}
