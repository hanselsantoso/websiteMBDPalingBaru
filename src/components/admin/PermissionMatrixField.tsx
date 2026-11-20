'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import {
  ACTIONS,
  MODULES,
  normalizeMatrix,
  type ActionKey,
  type ModuleKey,
  type PermissionMatrix,
} from '@/lib/domain/permissions'
import './admin.css'

type Props = { path: string; readOnly?: boolean }

export function PermissionMatrixField({ path, readOnly }: Props) {
  const { value, setValue } = useField<PermissionMatrix>({ path })
  const roleKey = useFormFields(([fields]) => fields?.key?.value as string | undefined)
  const matrix = normalizeMatrix(value)
  const isSuperAdmin = roleKey === 'super-admin'
  const disabled = readOnly || isSuperAdmin

  const update = (next: PermissionMatrix) => setValue(normalizeMatrix(next))

  const toggle = (moduleKey: ModuleKey, action: ActionKey) => {
    const current = matrix[moduleKey]?.actions ?? []
    const actions = current.includes(action) ? current.filter((a) => a !== action) : [...current, action]
    // Every other action implies being able to view the module.
    if (action !== 'lihat' && !actions.includes('lihat') && actions.length) actions.push('lihat')
    update({ ...matrix, [moduleKey]: { actions, scope: matrix[moduleKey]?.scope ?? 'all' } })
  }

  const setScope = (moduleKey: ModuleKey, scope: 'all' | 'own') => {
    const current = matrix[moduleKey]
    if (!current) return
    update({ ...matrix, [moduleKey]: { ...current, scope } })
  }

  return (
    <div className="ad-field">
      <span className="ad-label">Matriks izin</span>
      {isSuperAdmin ? (
        <p className="ad-note">Super Admin selalu memiliki akses penuh. Matriks di bawah hanya sebagai catatan.</p>
      ) : (
        <p className="ad-note">
          Centang aksi per modul. Memberi aksi apa pun otomatis menambahkan “Lihat”. “Milik sendiri” membatasi ke data yang dibuat pengguna.
        </p>
      )}
      <div className="ad-table-wrap">
        <table className="ad-matrix">
          <thead>
            <tr>
              <th scope="col">Modul</th>
              {ACTIONS.map((action) => (
                <th key={action.key} scope="col" title={action.label}>
                  {action.label}
                </th>
              ))}
              <th scope="col">Cakupan</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module) => (
              <tr key={module.key}>
                <th scope="row">{module.label}</th>
                {ACTIONS.map((action) => (
                  <td key={action.key}>
                    <input
                      type="checkbox"
                      className="ad-check"
                      aria-label={`${module.label}: ${action.label}`}
                      checked={isSuperAdmin || (matrix[module.key]?.actions.includes(action.key) ?? false)}
                      disabled={disabled}
                      onChange={() => toggle(module.key, action.key)}
                    />
                  </td>
                ))}
                <td>
                  <select
                    aria-label={`Cakupan ${module.label}`}
                    value={matrix[module.key]?.scope ?? 'all'}
                    disabled={disabled || !matrix[module.key]}
                    onChange={(event) => setScope(module.key, event.target.value as 'all' | 'own')}
                  >
                    <option value="all">Semua data</option>
                    <option value="own">Milik sendiri</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
