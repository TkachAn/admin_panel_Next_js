//src/elem/inputs/inputs.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Inputs.module.css";

const NoteInput = ({
  label = "",
  initialValue = "", // Добавим initialValue для инициализации внутреннего состояния
  onChange: externalOnChange, // Переименуем внешний onChange для ясности
  placeholder = "Напишите, если есть замечания или особенности...",
  className = "",
  rows = 4,
  status = "normal", // normal | accent | blocked
  ...restProps
}) => {
  const [value, setValue] = useState(initialValue);
  const isBlocked = status === "blocked";

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      // Вызываем внешний обработчик onChange, если он был передан
      if (externalOnChange) {
        externalOnChange(event);
      }
    },
    [externalOnChange]
  );

  useEffect(() => {
    setValue(initialValue); // Обновляем внутреннее состояние при изменении initialValue извне
  }, [initialValue]);

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={isBlocked}
        className={`${styles.textarea} ${styles[status]}`}
        {...restProps}
      />
    </div>
  );
};

const PassInput = ({
  label = "",
  value,
  onChange,
  placeholder = "Введите пароль",
  status = "normal",
  className = "",
}) => {
  const isBlocked = status === "blocked";

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
      />
    </div>
  );
};
const NumInput = ({
  label = "",
  value,
  onChange,
  placeholder = "Введите число",
  className = "",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
      />
    </div>
  );
};
const EmailInput = ({
  placeholder = "Введите e-mail",
  status = "normal",
  label = "",
  errorMessage: externalErrorMessage, // Переименовали для ясности
  onBlur: externalOnBlur, // Переименовали для ясности
  onFocus,
  autoComplete,
  className = "",
  id,
  ...restProps
}) => {
  const [value, setValue] = useState("");
  const [internalErrorMessage, setInternalErrorMessage] = useState("");
  const isBlocked = status === "blocked";
  const inputClassName = `${styles.input} ${styles[status]}`;

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      setInternalErrorMessage(""); // Сбрасываем внутреннюю ошибку при изменении
      // Если внешний обработчик onChange был передан, вызываем и его
      if (restProps.onChange) {
        restProps.onChange(event);
      }
    },
    [restProps.onChange]
  );

  const handleBlur = useCallback(
    (event) => {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setInternalErrorMessage("Введите корректный e-mail");
      } else {
        setInternalErrorMessage("");
      }
      // Если внешний обработчик onBlur был передан, вызываем и его
      if (externalOnBlur) {
        externalOnBlur(event);
      }
    },
    [value, externalOnBlur]
  );

  // Определяем, какое сообщение об ошибке отображать (внешнее или внутреннее)
  const errorMessageToDisplay = externalErrorMessage || internalErrorMessage;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type="email"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
        onBlur={handleBlur}
        onFocus={onFocus}
        autoComplete={autoComplete}
        {...restProps}
      />
      {errorMessageToDisplay && (
        <div className={styles.errorMessage}>{errorMessageToDisplay}</div>
      )}
    </div>
  );
};
// src/elem/inputs/inputs.jsx
const EmailModInput = ({
  placeholder = "Введите e-mail",
  status = "normal",
  label = "",
  errorMessage: externalErrorMessage,
  onBlur: externalOnBlur,
  onFocus,
  autoComplete,
  className = "",
  id,
  onChange: externalOnChange,
  onValidation, // Теперь ожидаем функцию для булевого значения
  ...restProps
}) => {
  const [value, setValue] = useState("");
  const [internalErrorMessage, setInternalErrorMessage] = useState("");
  const isBlocked = status === "blocked";
  const inputClassName = `${styles.input} ${styles[status]}`;

  const isValidEmail = (email) => {
    const emailRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    return emailRegex.test(email);
  };

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      setInternalErrorMessage("");
      if (externalOnChange) {
        externalOnChange(event);
      }
      if (onValidation) {
        //onValidation(isValidEmail(event.target.value)); // Передаем результат валидации
        onValidation(event.target.value === "" || isValidEmail(event.target.value));
      }
    },
    [externalOnChange, onValidation, isValidEmail]
  );

  const handleBlur = useCallback(
    (event) => {
      const currentValue = event.target.value;
      const isValid = isValidEmail(currentValue);
      //if (!isValid) {
        if (!isValid && currentValue !== "") {
          setInternalErrorMessage("Введите корректный e-mail");
        if (onValidation) {
          onValidation(false); // Передаем false при невалидном значении
        }
      } else {
        setInternalErrorMessage("");
        if (onValidation) {
          onValidation(true); // Передаем true при валидном значении
        }
      }
      if (externalOnBlur) {
        externalOnBlur(event);
      }
    },
    [externalOnBlur, isValidEmail, onValidation]
  );

  const errorMessageToDisplay = externalErrorMessage || internalErrorMessage;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type="email"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
        onBlur={handleBlur}
        onFocus={onFocus}
        autoComplete={autoComplete}
        {...restProps}
      />
      {errorMessageToDisplay && (
        <div className={styles.errorMessage}>{errorMessageToDisplay}</div>
      )}
    </div>
  );
};

const TextInput = ({

  label = "",
  value,
  onChange,
  placeholder = "Введите текст",
  className = "",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
      />
    </div>
  );
};
const TextModInput = ({
  type="text",
  label = "",
  initialValue = "", // Добавим initialValue для инициализации внутреннего состояния
  onChange: externalOnChange, // Переименуем внешний onChange для ясности
  placeholder = "Введите текст",
  className = "",
  status = "normal",
  ...restProps
}) => {
  const [value, setValue] = useState(initialValue);
  const isBlocked = status === "blocked";

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      // Вызываем внешний обработчик onChange, если он был передан
      if (externalOnChange) {
        externalOnChange(event);
      }
    },
    [externalOnChange]
  );

  useEffect(() => {
    setValue(initialValue); // Обновляем внутреннее состояние при изменении initialValue извне
  }, [initialValue]);

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
        {...restProps}
      />
    </div>
  );
};
const SelectInput = ({
  label = "",
  value,
  onChange,
  options = [],
  className = "",
  status = "normal",
}) => {
  const isBlocked = status === "blocked";

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={isBlocked}
        className={`${styles.select} ${styles[status]}`}
      >
        <option value="">Выберите роль</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const PhoneInput = ({
  onChange: externalOnChange,
  type = "text",
  placeholder = "+380xxxxxxxxx",
  status = "normal",
  label = "",
  errorText,
  errorMessage: externalErrorMessage,
  onBlur: externalOnBlur,
  onValidation, // Пропс для передачи состояния валидности
  onFocus,
  autoComplete,
  id,
  className = "",
  isPhoneNumber = false, // Новый пропс, указывающий, что это поле для телефона
  ...rest
}) => {
  const [value, setValue] = useState("+380");
  const [internalErrorMessage, setInternalErrorMessage] = useState("");
  const isBlocked = status === "blocked";
  const inputClassName = `${styles.input} ${styles[status]}`;

  const validatePhoneNumber = (number) => {
    if (!isPhoneNumber) {
      return true; // Если валидация не включена, считаем валидным
    }
    const cleaned = ('' + number).replace(/\D/g, ''); // Удаляем все нецифровые символы
    return cleaned.length === 12; // Пример: проверяем, что длина номера 12 цифр (формат Украины)
  };

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      setInternalErrorMessage("");
      if (externalOnChange) {
        externalOnChange(event);
      }
      if (onValidation) {
        //onValidation(validatePhoneNumber(event.target.value));
        onValidation(event.target.value === "" || validatePhoneNumber(event.target.value));
      }
    },
    [externalOnChange, onValidation, isPhoneNumber]
  );

  const handleBlur = useCallback(
    (event) => {
      const currentValue = event.target.value;
      //const isValid = validatePhoneNumber(currentValue);
      //if (!isValid && isPhoneNumber) {
        const isValid = currentValue === "" || validatePhoneNumber(currentValue);
      if (!isValid && currentValue !== "") {
        setInternalErrorMessage("Введите корректный номер телефона (13 символов)");
        if (onValidation) {
          onValidation(false);
        }
      } else {
        setInternalErrorMessage("");
        if (onValidation) {
          onValidation(true);
        }
      }
      if (externalOnBlur) {
        externalOnBlur(event);
      }
    },
    [externalOnBlur, onValidation, isPhoneNumber]
  );

  const errorMessageToDisplay = externalErrorMessage || internalErrorMessage;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type="tel" // Изменили type на "tel"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isBlocked}
        className={`${styles.input} ${styles[status]}`}
        onBlur={handleBlur}
        onFocus={onFocus}
        autoComplete={autoComplete}
        {...rest}
      />
      {errorMessageToDisplay && (
        <div className={styles.errorMessage}>{errorMessageToDisplay}</div>
      )}
    </div>
  );
};
const PriceInput = ({
  value: initialValue,
  onChange,
  placeholder = "0.00",
  status = "normal",
  label = "",
  errorText,
  className = "",
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(
    formatDisplayValue(initialValue)
  );
  const [isValidPrice, setIsValidPrice] = useState(true);
  const isBlocked = status === "blocked";
  const isError = status === "error" || !isValidPrice;

  // Функция для преобразования внутреннего значения в отображаемый формат
  function formatDisplayValue(value) {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "";
    }
    return (num / 100).toFixed(2);
  }

  // Функция для преобразования отображаемого значения во внутреннее (центы)
  function parseInputValue(displayValue) {
    if (displayValue === "") {
      return "";
    }
    const num = parseFloat(displayValue);
    if (isNaN(num)) {
      return null;
    }
    return Math.round(num * 100);
  }

  const handleChange = useCallback(
    (event) => {
      const newDisplayValue = event.target.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1"); // Разрешаем только цифры и одну точку

      setInputValue(newDisplayValue);

      const parsedValue = parseInputValue(newDisplayValue);
      if (parsedValue !== null) {
        onChange({ target: { value: parsedValue } }); // Отправляем значение в "центах"
        setIsValidPrice(true);
      } else {
        setIsValidPrice(false);
        onChange({ target: { value: null } }); // Или другое значение по умолчанию при ошибке
      }
    },
    [onChange]
  );

  // Обновляем отображаемое значение при изменении initialValue извне
  useEffect(() => {
    setInputValue(formatDisplayValue(initialValue));
  }, [initialValue]);

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
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
      {isError && (
        <div className={styles.error}>
          {errorText || "Некорректный формат цены"}
        </div>
      )}
    </div>
  );
};

export {
  EmailModInput,
  TextModInput,
  SelectInput,
  EmailInput,
  PhoneInput,
  PassInput,
  PriceInput,
  TextInput,
  NumInput,
  NoteInput,
};
