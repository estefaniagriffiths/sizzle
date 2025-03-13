import { useState } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'


export function useAuth() {
  const [loading, setLoading] = useState(false)

  async function signInWithEmail(email: string, password: string) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) Alert.alert(error.message)
    else Alert.alert('Logged in')
    setLoading(false)
  }

  async function signUpWithEmail(email: string, password: string) {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return {
    signInWithEmail, signUpWithEmail, loading
  }
}


/* OLD SIGN IN
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);

    setLoading(false);
  }
*/