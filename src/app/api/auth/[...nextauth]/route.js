//src/app/api/[...nextauth]/route.js

// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import query from '@/app/lib/db';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        pass: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const { email, pass } = credentials;
        console.log('Входящие креденшелы:', credentials);

        const result = await query(
          'SELECT * FROM users WHERE email = ? LIMIT 1',
          [email]
        );

        if (!result || result.length === 0) {
          console.log('Пользователь не найден');
          return null;
        }

        const user = result[0];
        console.log('Из БД (хэш):', user.pass);
        console.log('Введено (plain):', pass);

        const isValid = await bcrypt.compare(pass, user.pass);
        if (!isValid) {
          console.log('Пароль не совпал');
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret',
});

export { handler as GET, handler as POST };


/*
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt'
import query from '@/app/lib/db';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        pass: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const { email, pass } = credentials;
      
        console.log('Входящие креденшелы:', credentials);
      
        const result = await query(
          'SELECT * FROM users WHERE email = ? LIMIT 1',
          [email]
        );
      
        if (!result || result.length === 0) {
          
          return null;
        }
      
        const user = result[0];
        console.log('Из БД:', user.pass);
        console.log('Введено:', pass);
      
        if (user.pass !== pass) {
          console.log('Пароль не совпал');
          return null;
        }
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
      

     /* async authorize(credentials) {
        const { email, pass } = credentials;

        const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
        if (!users.length) return null;

        const user = users[0];
        if (user.pass !== pass) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },*/
 /*   }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret',
});

export { handler as GET, handler as POST };


/*
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import query from '@/app/lib/db'; // подключаем свою обёртку

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        pass: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, pass } = credentials;
        console.log('Найден пользователь:', user);
        console.log('Введённый пароль:', pass);
        // 1. Получаем пользователя из БД
        const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
        if (!users.length) return null;

        const user = users[0];

        // 2. Проверка пароля (временно без хэша)
        if (user.pass !== pass) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret',
});

export { handler as GET, handler as POST };


/*
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        pass: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, pass } = credentials;
        const root_login = process.env.ROOT_USER;
        const root_pass = process.env.ROOT_PASS;

        console.log("root_login",root_login);
        console.log("root_pass",root_pass);

        // 🔐 Здесь можно поставить свою логику проверки пользователя
        if (email === 'admin@i.ua' && pass === 'admin'|| email === root_login && pass === root_pass ) {
          return { id: 1, name: 'Admin', email };
        }

        return null; // если не совпадает — ошибка
      },
    }),
  ],
  pages: {
    signIn: '/auth', // чтобы он показывал твой логин, а не дефолтный
    error: '/auth',  // можно редиректить ошибки туда же
  },
  session: {
    strategy: 'jwt', // или 'database' — зависит от нужд
  },
  secret: process.env.NEXTAUTH_SECRET, // обязательно в .env
});

export { handler as GET, handler as POST };*/
