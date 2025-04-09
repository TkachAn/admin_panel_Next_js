//src/comp/auth/LoginForm.jsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './form.module.css';
import { EmailInput, PassInput } from '@/elem/inputs';

export const metadata = {
  title: 'Авторизация | Garden plots',
  description: 'Вход в систему учёта электроэнергии',
};

export default function AuthPage({ title = 'Вход' }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  
  const isValid = email.trim() && pass.trim();

  // Обработчик для email
  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Обновляем состояние строкой
  };

  // Обработчик для пароля
  const handlePassChange = (event) => {
    setPass(event.target.value); // Обновляем состояние строкой
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      pass,
      callbackUrl: '/',
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleLogin}  className={styles.loginForm}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
      {/*<input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />*/}

<PassInput value={pass} onChange={(e) => setPass(e.target.value)} />
{error && <p className={styles.error}>{error}</p>}
      {/*<input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Пароль"
      />*/}

{/*<Button onClick={handleLogin} disabled={!isValid}>
        Войти
      </Button>*/}
      <button type="submit" className={styles.submit}>Войти</button>
    </form>
  );
}


/*
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailInput, PassInput } from '../../elem/inputs';
import { Button } from '../../elem/button';
import styles from './form.module.css'; 

export const metadata = {
  title: 'Авторизация | Garden plots',
  description: 'Вход в систему учёта электроэнергии',
};

export default function LoginForm({ title = 'Вход' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const isValid = email.trim() && pass.trim();

  // Обработчик для email
  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Обновляем состояние строкой
  };

  // Обработчик для пароля
  const handlePassChange = (event) => {
    setPass(event.target.value); // Обновляем состояние строкой
  };

  const handleLogin = () => {
    if (email === 'admin@i.ua' && pass === 'admin') {
      router.push('/home');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className={styles.loginForm}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <EmailInput value={email} onChange={handleEmailChange} />
      <PassInput value={pass} onChange={handlePassChange} />
      {error && <p className={styles.error}>{error}</p>}
      <Button onClick={handleLogin} disabled={!isValid}>
        Войти
      </Button>
    </div>
  );
}

*/
//<Button onClick={handleLogin} disabled={!isValid}></Button><Button onClick={handleLogin}>