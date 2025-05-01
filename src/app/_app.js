// src/app/_app.js

import '../styles/global.css'; // Подключаем глобальные стили

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
