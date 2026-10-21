import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fbfbf9',
          color: '#16181c',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#e6f0ea',
              color: '#0f6b4a',
              borderRadius: 999,
              padding: '10px 20px',
              fontSize: 24,
            }}
          >
            {site.availability}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={{ fontSize: 86, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </span>
          <span style={{ fontSize: 34, color: '#5c6168' }}>
            {site.role}, {site.location}
          </span>
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #e4e4df', paddingTop: 26, fontSize: 30 }}>
          {site.statement}
        </div>
      </div>
    ),
    size,
  );
}
