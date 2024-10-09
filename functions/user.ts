import { supabase } from '~/lib/supabase';

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('users').select().eq('id', userId).single();
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: false, data: data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
