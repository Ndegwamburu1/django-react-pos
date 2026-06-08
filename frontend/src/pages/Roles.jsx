import { useMemo, useState } from 'react'

const startingRoles = [
  { id: 1, name: 'Admin' },
]

export default function Roles({ setStatus }) {
  const [roles, setRoles] = useState(startingRoles)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [roleName, setRoleName] = useState('')

  const visibleRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [roles, query])

  function resetForm() {
    setRoleName('')
    setEditingRoleId(null)
    setShowForm(false)
  }

  function saveRole(event) {
    event.preventDefault()

    if (!roleName.trim()) {
      setStatus('Role name is required.')
      return
    }

    if (editingRoleId) {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === editingRoleId ? { ...role, name: roleName.trim() } : role,
        )
      )
      setStatus('Role updated.')
      resetForm()
      return
    }

    setRoles((currentRoles) => [
      ...currentRoles,
      { id: Date.now(), name: roleName.trim() },
    ])
    setStatus('Role added.')
    resetForm()
  }

  function editRole(role) {
    setRoleName(role.name)
    setEditingRoleId(role.id)
    setShowForm(true)
    setStatus(`${role.name} loaded for editing.`)
  }

  function deleteRole(roleId) {
    setRoles((currentRoles) => currentRoles.filter((role) => role.id !== roleId))
    setStatus('Role deleted.')
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Roles</h3>
          <span>Manage roles</span>
        </div>

        <button
          onClick={() => {
            setShowForm((open) => !open)
            setRoleName('')
            setEditingRoleId(null)
          }}
        >
          {showForm ? 'Close' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={saveRole}>
          <label>
            Role name
            <input
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              placeholder="Admin"
              required
            />
          </label>

          <button type="submit">
            {editingRoleId ? 'Update Role' : 'Save Role'}
          </button>
        </form>
      )}

      <div className="users-card">
        <div className="users-card-header">
          <strong>All roles</strong>
        </div>

        <div className="users-toolbar">
          <label>
            Show
            <select defaultValue="25">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            entries
          </label>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ..."
          />
        </div>

        <div className="users-table">
          <div className="roles-row users-header">
            <span>Roles</span>
            <span>Action</span>
          </div>

          {visibleRoles.map((role) => (
            <div className="roles-row" key={role.id}>
              <span>{role.name}</span>

              <span className="users-actions">
                <button onClick={() => editRole(role)}>Edit</button>
                <button onClick={() => deleteRole(role.id)}>Delete</button>
              </span>
            </div>
          ))}

          {visibleRoles.length === 0 && (
            <div className="home-empty-row">No data available in table</div>
          )}
        </div>

        <div className="users-footer">
          <span>
            Showing {visibleRoles.length ? 1 : 0} to {visibleRoles.length} of {visibleRoles.length} entries
          </span>

          <div className="users-pagination">
            <button disabled={visibleRoles.length === 0}>Previous</button>
            {visibleRoles.length > 0 && <button className="active">1</button>}
            <button disabled={visibleRoles.length === 0}>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}