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

