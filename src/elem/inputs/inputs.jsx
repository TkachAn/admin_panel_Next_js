import React, { useState, useEffect, useCallback  }  from "react";
import { Textarea } from "./Textarea";
import styles from "./Inputs.module.css";

const NoteInput = ({ value, onChange, state = "normal", disabled = false }) => {
  return (
    <Textarea
      id="note"
      label="Примечание"
      value={value}
      onChange={onChange}
      placeholder="Напишите, если есть замечания или особенности..."
      rows={3}
      state={state}
      disabled={disabled}
      className={`${styles.input} }`}
    />
  );
};
const PassInput = ({
  value,
  onChange,
  placeholder = "Введите пароль",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="password"
      autoComplete="new-password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
const NumInput = ({
  value,
  onChange,
  placeholder = "Введите число",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
const EmailInput = ({
  value,
  onChange,
  placeholder = "Введите e-mail",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="email"
      value={value} // Просто используем переданное значение
      onChange={onChange} // Передаем функцию onChange
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
const TextInput = ({
  value,
  onChange,
  placeholder = "Введите текст",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={isBlocked}
      className={`${styles.input} ${styles[status]}`}
    />
  );
};
const PhoneInput = ({
  value,
  onChange,
  type = "text",
  placeholder = "+380xxxxxxxxx",
  status = "normal",
  label,
  errorText,
  isPhoneNumber = false, // Новый пропс, указывающий, что это поле для телефона
  ...rest
}) => {
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const isBlocked = status === "blocked";
  const isError = status === "error" || !isValidPhoneNumber; // Отображаем ошибку, если статус "error" или номер невалидный

  useEffect(() => {
    if (isPhoneNumber && value) {
      // Регулярное выражение для проверки полного формата (+код страны + 10 цифр)
      const phoneRegex = /^\+\d{1,3}\d{8,12}$/; // Обновлено: 8-12 цифр после кода, чтобы в сумме было около 13
      setIsValidPhoneNumber(phoneRegex.test(value) || value.startsWith('+') || value === '');
    } else {
      setIsValidPhoneNumber(true); // Для обычных полей всегда валидно
    }
  }, [value, isPhoneNumber]);

  const handleChange = (event) => {
    onChange(event);
    // Дополнительная проверка во время ввода (до 13 символов после плюса)
    if (isPhoneNumber) {
      const phoneRegexPartial = /^\+\d{0,3}\d{0,12}$/; // Обновлено: до 12 цифр после кода
      setIsValidPhoneNumber(phoneRegexPartial.test(event.target.value) || event.target.value === '');
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={handleChange} // Используем нашу функцию handleChange
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${isError ? styles.error : styles[status]}`}
        {...rest}
      />
      {isError && <div className={styles.error}>{errorText || 'Некорректный номер телефона'}</div>}
    </div>
  );
};
const PriceInput = ({
  value: initialValue,
  onChange,
  placeholder = "0.00",
  status = "normal",
  label,
  errorText,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(formatDisplayValue(initialValue));
  const [isValidPrice, setIsValidPrice] = useState(true);
  const isBlocked = status === "blocked";
  const isError = status === "error" || !isValidPrice;

  // Функция для преобразования внутреннего значения в отображаемый формат
  function formatDisplayValue(value) {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return '';
    }
    return (num / 100).toFixed(2);
  }

  // Функция для преобразования отображаемого значения во внутреннее (центы)
  function parseInputValue(displayValue) {
    if (displayValue === '') {
      return '';
    }
    const num = parseFloat(displayValue);
    if (isNaN(num)) {
      return null;
    }
    return Math.round(num * 100);
  }

  const handleChange = useCallback((event) => {
    const newDisplayValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); // Разрешаем только цифры и одну точку

    setInputValue(newDisplayValue);

    const parsedValue = parseInputValue(newDisplayValue);
    if (parsedValue !== null) {
      onChange({ target: { value: parsedValue } }); // Отправляем значение в "центах"
      setIsValidPrice(true);
    } else {
      setIsValidPrice(false);
      onChange({ target: { value: null } }); // Или другое значение по умолчанию при ошибке
    }
  }, [onChange]);

  // Обновляем отображаемое значение при изменении initialValue извне
  useEffect(() => {
    setInputValue(formatDisplayValue(initialValue));
  }, [initialValue]);

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${isError ? styles.error : styles[status]}`}
        {...rest}
      />
      {isError && <div className={styles.error}>{errorText || 'Некорректный формат цены'}</div>}
    </div>
  );
};

export { EmailInput,PhoneInput, PassInput, PriceInput, TextInput, NumInput, NoteInput };
