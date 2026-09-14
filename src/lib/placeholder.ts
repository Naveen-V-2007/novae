const PALETTE: Record<string, { bg: string; fg: string }> = {
  ink: { bg: "#171717", fg: "#F4F0E8" },
  bone: { bg: "#F4F0E8", fg: "#171717" },
  clay: { bg: "#B66A4C", fg: "#F4F0E8" },
  olive: { bg: "#59604A", fg: "#F4F0E8" },
  grey: { bg: "#D9D7D2", fg: "#171717" },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLabel(label: string, maxCharsPerLine = 16): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function placeholder(
  label: string,
  tone: keyof typeof PALETTE = "bone",
  width = 900,
  height = 1125
): string {
  const { bg, fg } = PALETTE[tone];
  const lines = wrapLabel(label.toUpperCase());
  const fontSize = Math.max(18, Math.round(width / 22));
  const lineHeight = fontSize * 1.4;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

  const textEls = lines
    .map(
      (line, i) =>
        `<text x="50%" y="${startY + i * lineHeight}" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" letter-spacing="1" fill="${fg}" opacity="0.75">${escapeXml(line)}</text>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${bg}"/>
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="1.5"/>
    ${textEls}
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
