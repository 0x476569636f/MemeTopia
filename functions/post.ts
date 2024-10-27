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

export const fetchPost = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *, 
        user: users (id, name, image),
        postLikes (*)
        `
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(error);
      return { success: false, msg: 'Error when fetching post' };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error(error);
    return { success: false, msg: 'Error when fetching post' };
  }
};

export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase.from('postLikes').insert(postLike).select().single();

    if (error) {
      console.error(error);
      return { success: false, msg: 'Error when Like Post' };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error(error);
    return { success: false, msg: 'Error when Like Post' };
  }
};

export const removePostLike = async (postId: any, userId: any) => {
  try {
    const { error } = await supabase
      .from('postLikes')
      .delete()
      .eq('postId', postId)
      .eq('userId', userId);

    if (error) {
      console.error(error);
      return { success: false, msg: 'Error when Like Post' };
    }
    return { success: true, msg: 'Post unliked' };
  } catch (error) {
    console.error(error);
    return { success: false, msg: 'Error when unlike Post' };
  }
};
