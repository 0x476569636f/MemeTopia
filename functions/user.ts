import { supabase } from '~/lib/supabase';
import { Asset } from 'expo-asset';
import { getSupabaseFileUrl } from './storage';

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('users').select().eq('id', userId).single();
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data: data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const getUserImageSrc = (imagePath: string) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return Asset.fromModule(require('../assets/bg.png')).uri;
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    const { error } = await supabase.from('users').update(data).eq('id', userId);
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
