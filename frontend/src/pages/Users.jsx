export default function Users({
  users,
  showUserForm,
  setShowUserForm,
  userForm,
  setUserForm,
  saveUser,
}) {
  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Users</h3>
          <span>Manage users</span>
        </div>

        <button onClick={() => setShowUserForm((open) => !open)}>
          {showUserForm ? 'Close' : '+ Add'}
        </button>
      </div>

      {showUserForm && (
        <form className="user-form" onSubmit={saveUser}>
          <label>
            Username
            <input
              value={userForm.username}
              onChange={(event) => setUserForm({ ...userForm, username: event.target.value })}
              required
            />
          </label>

          <label>
            First name
            <input
              value={userForm.first_name}
              onChange={(event) => setUserForm({ ...userForm, first_name: event.target.value })}
            />
          </label>

          <label>
            Last name
            <input
              value={userForm.last_name}
              onChange={(event) => setUserForm({ ...userForm, last_name: event.target.value })}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={userForm.email}
              onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={userForm.password}
              onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
              required
            />
          </label>

          <button type="submit">Save User</button>
        </form>
      )}

      <div className="users-card">
        <div className="users-card-header">
          <strong>All users</strong>
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

          <input placeholder="Search ..." />
        </div>

        <div className="users-table">
          <div className="users-row users-header">
            <span>Username</span>
            <span>Name</span>
            <span>Role</span>
            <span>Email</span>
            <span>Action</span>
          </div>

          {users.map((user) => (
            <div className="users-row" key={user.id}>
              <span>{user.username}</span>
              <span>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || '-'}</span>
              <span>{user.role || 'No role'}</span>
              <span>{user.email || '-'}</span>
              <span className="users-actions">Edit | Delete</span>
            </div>
          ))}
        </div>

        <div className="users-footer">
          <span>Showing 1 to {users.length} of {users.length} entries</span>

          <div className="users-pagination">
            <button>Previous</button>
            <button className="active">1</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}