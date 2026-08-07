import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, placeholder, error, ...rest }, ref) => {
    return (
      <div className={styles.field}>
        {label && <label className={styles.label}>{label}</label>}
        <select ref={ref} className={styles.select} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
