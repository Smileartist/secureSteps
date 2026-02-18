const fs = require('fs');

const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <path d="M50 5 L87 18 L87 54 Q87 76 50 92 Q13 76 13 54 L13 18 Z" fill="url(#g)"/>
  <path d="M50 12 L81 24 L81 53 Q81 71 50 86 Q19 71 19 53 L19 24 Z" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
  <g transform="rotate(22, 62, 37)">
    <ellipse cx="62" cy="37" rx="6.5" ry="10" fill="white" opacity="0.93"/>
    <circle cx="57.5" cy="27"  r="2.7" fill="white" opacity="0.93"/>
    <circle cx="62"   cy="25.5" r="2.4" fill="white" opacity="0.93"/>
    <circle cx="66.5" cy="27"  r="2.1" fill="white" opacity="0.93"/>
  </g>
  <g transform="rotate(-22, 38, 63)">
    <ellipse cx="38" cy="63" rx="6.5" ry="10" fill="white" opacity="0.93"/>
    <circle cx="42.5" cy="53"  r="2.7" fill="white" opacity="0.93"/>
    <circle cx="38"   cy="51.5" r="2.4" fill="white" opacity="0.93"/>
    <circle cx="33.5" cy="53"  r="2.1" fill="white" opacity="0.93"/>
  </g>
</svg>`;

fs.writeFileSync('favicon.svg', faviconSVG, 'utf8');
console.log('favicon.svg written successfully');
