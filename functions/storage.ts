import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '~/lib/supabase';

export const uploadFile = async (folderName: string, fileUri: string, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imageData = decode(fileBase64);

    const { data, error } = await supabase.storage.from('assets').upload(fileName, imageData, {
      contentType: isImage ? 'image/*' : 'video/*',
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data: data.path };
  } catch (error: any) {
    return { success: false, msg: 'Error when uploading media' };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
};

export const getSupabaseFileUrl = (filePath: string) => {
  if (filePath) {
    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    return { uri: data.publicUrl };
  }
  return null;
};
