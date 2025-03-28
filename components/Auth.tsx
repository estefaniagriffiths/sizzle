import { useState } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router';

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  async function signInWithEmail(email: string, password: string) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) { 
      Alert.alert(error.message)
    }
    else { 
      Alert.alert('Logged in')
      router.replace('/Home')
    }

    setLoading(false)
  }

  async function signUpWithEmail(username: string, email: string, password: string) {
    setLoading(true)

    const { data: userExists } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (userExists) {
      Alert.alert('Username is unavailable.')
      setLoading(false)
      return
    }

    const { data, error, } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { username },
      }
    })

    if (error) { 
      Alert.alert(error.message)
    }
    else if (!data?.session) {
      Alert.alert('Please check your inbox for email verification!')
      router.replace('/SignInScreen')
    }

    setLoading(false)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(error.message);
    } 
    else {
      Alert.alert('Logged out.')
      router.replace('/');
    }
  }
  

  return {
    signInWithEmail, signUpWithEmail, signOut, loading
  }
}
