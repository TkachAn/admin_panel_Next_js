// src/components/ErrorPage.jsx
import React from "react";
import s from "./ErrorPage.module.css"; // Создайте этот CSS-модуль для стилей


const ErrorInfo = ({ statusCode = 404, message }) => {
  return (
    <div className={s.errorContainer}>
        <img src="/1flash.png" alt="1flash" className={s.logoImg}/>
      <h1 className={s.errorCode}>{statusCode}</h1>
      <p className={s.errorMessage}>
        {message || "Произошла непредвиденная ошибка."}
      </p>
      
      {statusCode === 404 && (
        <p className={s.errorSuggestion}>
          Возможно, страница не существует или была перемещена.
        </p>
      )}
      {/* Добавьте другие условные сообщения или кнопки "Назад" по желанию */}
    
    </div>
  );
};

export default ErrorInfo;

/*
      <div className={s.centeredWrapper}>
        <div className={s.modalPanel}>
          <div className={s.dialogTitle}>Ошибка</div>
          <div className={s.picGroup}>
            <div className={s.pic}>
              
              <img src="chock_chock.png" alt="dack" />
            </div>
            <div className={s.message}>{message}</div>
          </div>
        </div>
      </div>
*/
