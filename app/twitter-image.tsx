import { ImageResponse } from 'next/og';

export const alt = 'skape.io — Secure digital infrastructure';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const TwitterImage = () => new ImageResponse(
  (
    <div
      style={{
        alignItems: 'flex-start',
        background: '#050505',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em' }}>
        skape.io
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
          Secure digital infrastructure.
        </div>
        <div style={{ color: '#a3a3a3', fontSize: 30 }}>
          Web · Cloud · DevOps · Networking · Privacy · AI
        </div>
      </div>
    </div>
  ),
  size,
);

export default TwitterImage;
