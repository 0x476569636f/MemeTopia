import { supabase } from '~/lib/supabase';
import { uploadFile } from './storage';

export const createOrUpdatePost = async (post: any) => {
  try {
    if (post.file && typeof post.file == 'object') {
      let isImage = post?.file?.type == 'image';
      let folderName = isImage ? 'postImages' : 'postVideos';
      let fileRes = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileRes.success) {
        post.file = fileRes.data;
      } else {
        return fileRes;
      }

      const { data, error } = await supabase.from('posts').upsert(post).select().single();

      if (error) {
        console.error(error);
        return { success: false, msg: 'Error when creating or updating post' };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, msg: 'Error when creating or updating post' };
  }
};
