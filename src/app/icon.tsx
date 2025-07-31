import { ImageResponse } from 'next/og'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#3b82f6',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{ color: 'white' }}
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
