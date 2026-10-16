
import { useState } from "react";
import CategorySelector from "./components/CategorySelector";
import TaskList from "./components/TaskList";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="container">
      <h1>Productivity Tracker</h1>

      <CategorySelector
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <TaskList selectedCategory={selectedCategory} />
    </main>
  );
}
