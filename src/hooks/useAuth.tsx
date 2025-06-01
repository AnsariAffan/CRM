
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integration/supabase/client';


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    
    const data = await supabase.auth.signUp({
      email,
      password,
      options: {
       data: userData || {}
      }
    });
   console.log(data)
    return data;
  };





  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };

  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



//bypas

// import { useState, useEffect, createContext, useContext } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integration/supabase/client';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   loading: boolean;
//   signUp: (email: string, password: string, userData?: any) => Promise<any>;
//   signIn: (email: string, password: string) => Promise<any>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const runAuthFlow = async () => {
//       if (import.meta.env.DEV) {
//         // 🔐 Bypass login in development
//         const mockUser = {
//           id: 'mock-user-id',
//           email: 'dev@example.com',
//           role: 'authenticated',
//           aud: 'authenticated',
//           app_metadata: {},
//           user_metadata: {},
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         } as User;

//         const mockSession = {
//           access_token: 'mock-access-token',
//           token_type: 'bearer',
//           expires_in: 3600,
//           refresh_token: 'mock-refresh-token',
//           expires_at: Math.floor(Date.now() / 1000) + 3600,
//           user: mockUser,
//         } as Session;

//         setUser(mockUser);
//         setSession(mockSession);
//         setLoading(false);
//         return;
//       }

//       // ✅ Real Supabase Auth Flow (for production)
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);

//       const { data: { subscription } } = supabase.auth.onAuthStateChange(
//         async (_event, session) => {
//           setSession(session);
//           setUser(session?.user ?? null);
//           setLoading(false);
//         }
//       );

//       return () => subscription.unsubscribe();
//     };

//     runAuthFlow();
//   }, []);

//   const signUp = async (email: string, password: string, userData?: any) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: { data: userData },
//     });
//     return { data, error };
//   };

//   const signIn = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     return { data, error };
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setSession(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         session,
//         loading,
//         signUp,
//         signIn,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
