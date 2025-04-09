//src/app/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import query from '@/app/lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        pass: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, pass } = credentials;

        // Находим пользователя
        const result = await query(
          'SELECT * FROM users WHERE email = ? LIMIT 1',
          [email]
        );

        if (!result || result.length === 0) return null;

        const user = result[0];

        // Сравниваем пароль (временно без хэша)
        if (user.pass !== pass) return null;

        // Всё ок — возвращаем, что попадёт в JWT
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
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      // При логине добавляем данные в токен
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Прокидываем токен в session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || 'super-secret', // создай .env
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
