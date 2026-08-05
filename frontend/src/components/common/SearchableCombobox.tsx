import { useState } from "react";
import styles from "./SearchableCombobox.module.css";

type SearchableComboboxProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder,
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = value
    ? options.filter((option) => option.toLowerCase().includes(value.toLowerCase()))
    : options;

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className={styles.input}
      />

      {isOpen && filtered.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {filtered.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={styles.option}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
