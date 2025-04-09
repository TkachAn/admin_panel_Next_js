//src/elem/LogoutButton.js

// src/elem/LogoutButton.js
'use client';

import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <button onClick={handleLogout}>
      Выйти
    </button>
  );
};

export default LogoutButton;


/*
('use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    // Удаляем куки authToken на сервере (через API-маршрут)
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Перенаправляем пользователя на страницу логина после успешного выхода
      router.push('/auth');
    } else {
      console.error('Ошибка при выходе');
      // Можно показать пользователю сообщение об ошибке
    }
  }, [router]);

  return (
    <button>Выйти</button>
  );
};

export default LogoutButton;)*/