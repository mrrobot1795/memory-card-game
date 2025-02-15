import React from "react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onChange,
}) => (
  <>
    <h2>Choose an Emoji Category</h2>
    <div className="select-wrapper">
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  </>
);
