'use client'

import { useField } from '@payloadcms/ui'
import { DEFAULT_BRAND, evaluateBrandContrast, resolveBrandColors } from '@/lib/brand/tokens'
import './admin.css'

export function ContrastChecker() {
  const blue = useField<string>({ path: 'colors.blue' })
  const navy = useField<string>({ path: 'colors.navy' })
  const lime = useField<string>({ path: 'colors.lime' })
  const cyan = useField<string>({ path: 'colors.cyan' })

  const colors = resolveBrandColors({ blue: blue.value, navy: navy.value, lime: lime.value, cyan: cyan.value })
  const results = evaluateBrandContrast(colors)
  const failures = results.filter((result) => !result.pass)

  const reset = () => {
    blue.setValue(DEFAULT_BRAND.blue)
    navy.setValue(DEFAULT_BRAND.navy)
    lime.setValue(DEFAULT_BRAND.lime)
    cyan.setValue(DEFAULT_BRAND.cyan)
  }

  return (
    <div className="ad-panel">
      <div className="ad-panel__head">
        <strong>Pemeriksa kontras (WCAG 2.2 AA)</strong>
        <button type="button" className="ad-btn" onClick={reset}>
          Pulihkan warna bawaan
        </button>
      </div>
      {failures.length ? (
        <p className="ad-alert ad-alert--error" role="status">
          {failures.length} pasangan belum lolos. Perubahan warna akan ditolak saat disimpan sampai semuanya lolos.
        </p>
      ) : (
        <p className="ad-alert ad-alert--ok" role="status">
          Semua pasangan teks dan latar lolos AA.
        </p>
      )}
      <p className="ad-alert ad-alert--warn">
        Lime ({colors.lime}) adalah warna terang. Pakai hanya di latar navy atau biru, jangan sebagai teks atau isian di latar putih.
      </p>
      <ul className="ad-contrast">
        {results.map((result) => (
          <li key={`${result.fg}-${result.bg}`}>
            <span className="ad-swatch" style={{ background: result.background, color: result.foreground }}>
              Aa
            </span>
            <span>
              <strong>{result.usage}</strong>
              <br />
              <span className="ad-note">
                {result.fg} di {result.bg} · {result.ratio}:1 (minimal {result.min}:1)
              </span>
            </span>
            <span className={`ad-pill ${result.pass ? 'ad-pill--ok' : 'ad-pill--fail'}`}>{result.pass ? 'Lolos' : 'Gagal'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
