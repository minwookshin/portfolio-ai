const BLUR_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <rect width="16" height="16" fill="#F1F2F4"/>
    <path d="M0 12 5 7l3 3 3-4 5 6v4H0z" fill="#E2E4E9"/>
  </svg>
`;

export const BLUR_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(BLUR_SVG)}`;

export function makeVideoPosterDataUrl(label: string) {
  const safeLabel = label.toLowerCase().replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#F7F8F8"/>
      <rect x="1" y="1" width="1198" height="898" fill="none" stroke="#E2E4E9" stroke-width="2"/>
      <text x="600" y="454" text-anchor="middle" dominant-baseline="middle" fill="#62666D" font-family="Arial, sans-serif" font-size="42" letter-spacing="-1">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
