import UserData from './components/UserData';
import './App.css';

function App() {
  return (
    <main className="app">
      <h1>Redux Toolkit User App</h1>
      <p className="subtitle">
        Fetch and display user information using Redux Thunk.
      </p>

      <UserData />
    </main>
  );
}

export default App;
