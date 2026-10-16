
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../features/productivity/productivitySlice";
import { selectCategories } from "../features/productivity/productivitySelectors";

export default function CategorySelector({ selectedCategory, onSelect }) {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();

  function handleAddCategory() {
    const name = window.prompt("Enter a category name:");
    if (name?.trim()) {
      dispatch(addCategory(name.trim()));
    }
  }

  return (
    <section className="category-section">
      <label htmlFor="category">Filter by category: </label>

      <select
        id="category"
        value={selectedCategory}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleAddCategory}>
        Add Category
      </button>
    </section>
  );
}
