import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../features/users/userThunks';

function UserData() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.users);
  const [userId, setUserId] = useState('1');

  useEffect(() => {
    dispatch(fetchUser(1));
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const id = Number(userId);

    if (!Number.isInteger(id) || id < 1 || id > 10) {
      return;
    }

    dispatch(fetchUser(id));
  };

  return (
    <section className="user-panel">
      <h2>Fetch User Data</h2>

      <form onSubmit={handleSubmit} className="user-form">
        <label htmlFor="userId">User ID (1–10)</label>

        <input
          id="userId"
          type="number"
          min="1"
          max="10"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch User'}
        </button>
      </form>

      {loading && <p role="status">Loading user data...</p>}

      {error && <p className="error" role="alert">{error}</p>}

      {user && !loading && (
        <div className="user-details">
          <h3>{user.name}</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Website:</strong> {user.website}</p>
          <p><strong>City:</strong> {user.address.city}</p>
          <p><strong>Company:</strong> {user.company.name}</p>
        </div>
      )}
    </section>
  );
}

export default UserData;
