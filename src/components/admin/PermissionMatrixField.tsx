'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { DataTable } from '@/components/ui/DataTable'
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
      <DataTable
        label="Matriks izin"
        admin
        columns={[{ label: 'Modul' }, ...ACTIONS.map(action => ({ label: action.label })), { label: 'Cakupan' }]}
        rows={MODULES.map(module => {
          const permission = matrix[module.key]
          const allowed = ACTIONS.map(action => isSuperAdmin || (permission?.actions.includes(action.key) ?? false))
          return {
            id: module.key,
            values: [module.label, ...allowed.map(value => value ? 'Ya' : 'Tidak'), permission?.scope === 'own' ? 'Milik sendiri' : 'Semua data'],
            cells: [
              module.label,
              ...ACTIONS.map((action, index) => (
                <input
                  key={action.key}
                  type="checkbox"
                  className="ad-check"
                  aria-label={`${module.label}: ${action.label}`}
                  checked={allowed[index]}
                  disabled={disabled}
                  onChange={() => toggle(module.key, action.key)}
                />
              )),
              <select
                key="scope"
                aria-label={`Cakupan ${module.label}`}
                value={permission?.scope ?? 'all'}
                disabled={disabled || !permission}
                onChange={event => setScope(module.key, event.target.value as 'all' | 'own')}
              >
                <option value="all">Semua data</option>
                <option value="own">Milik sendiri</option>
              </select>,
            ],
          }
        })}
      />
    </div>
  )
}
