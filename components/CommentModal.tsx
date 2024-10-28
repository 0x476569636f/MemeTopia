import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Text } from './nativewindui/Text';
import Avatar from './Avatar';
import { formatDate } from '~/functions/Date';
import { useColorScheme } from '~/lib/useColorScheme';
import Loading from './Loading';
import { createComment, deleteComment, fetchPostComments } from '~/functions/post';
import { supabase } from '~/lib/supabase';
import { getUserData } from '~/functions/user';

interface CommentModalProps {
  isVisible: boolean;
  onClose: () => void;
  post: any;
  currentUser: any;
}

const CommentModal: React.FC<CommentModalProps> = ({ isVisible, onClose, post, currentUser }) => {
  const { isDarkColorScheme } = useColorScheme();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const commentChannel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        handleNewComment
      )
      .subscribe();

    if (isVisible) {
      getPostComments();
    }

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [post.id, isVisible]);

  const getPostComments = async () => {
    const res = await fetchPostComments(post.id);
    if (res.success) {
      const fetchedComments =
        res?.data?.[0]?.comments.map((comment) => ({
          ...comment,
          liked: false,
        })) || [];
      setComments(fetchedComments);
    }
  };

  const handleNewComment = async (payload: any) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      newComment.liked = false;
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  const onNewComment = async () => {
    if (newComment.length < 1) return;
    const data = {
      userId: currentUser.id,
      postId: post.id,
      body: newComment,
    };
    setLoading(true);
    const res = await createComment(data);
    setLoading(false);
    if (res.success) {
      setNewComment('');
    } else {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleDelete = (commentId: number) => {
    Alert.alert('Hapus', 'Apakah kamu yakin ingin menghapus komentar ini?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        onPress: () => onDeleteComment(commentId),
        style: 'destructive',
      },
    ]);
  };

  const onDeleteComment = async (commentId: number) => {
    const res = await deleteComment(commentId);
    if (res.success) {
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } else {
      Alert.alert('Error', res.msg);
    }
  };

  const handleLike = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, liked: !comment.liked } : comment
      )
    );
  };

  const renderComment = ({ item }: { item: any }) => {
    return (
      <View className="border-b border-border p-4">
        <View className="flex-row">
          <Avatar size={40} uri={item.user.image} />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="font-semibold">{item.user.name}</Text>
                <Text className="ml-2 text-xs text-muted-foreground">
                  {formatDate(item.created_at)}
                </Text>
              </View>
              {(currentUser.id === item.user.id || currentUser.id === post.userId) && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <View className="p-2">
                    <Feather name="trash" size={16} color="red" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <Text className="mt-1">{item.body}</Text>
            <View className="mt-2 flex-row items-center space-x-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => handleLike(item.id)}
                activeOpacity={0.7}>
                <FontAwesome
                  name={item.liked ? 'heart' : 'heart-o'}
                  size={16}
                  color={
                    item.liked
                      ? 'rgb(239, 68, 68)'
                      : isDarkColorScheme
                        ? 'rgb(0, 123, 254)'
                        : 'black'
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border p-4">
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'} />
          </TouchableOpacity>
          <Text className="mt-2 text-xl font-bold">Komentar</Text>
        </View>

        {/* Original Post */}
        <View className="border-b border-border p-4">
          <View className="flex-row">
            <Avatar size={40} uri={post?.user?.image} />
            <View className="ml-3 flex-1">
              <Text className="font-semibold">{post?.user?.name}</Text>
              <Text className="mt-1">{post?.body}</Text>
            </View>
          </View>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          keyExtractor={(comment) => comment.id.toString()}
          renderItem={renderComment}
          className="flex-1"
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="border-t border-border p-4">
          <View className="flex-row items-center gap-1">
            <Avatar size={32} uri={currentUser?.image} />
            <TextInput
              className="flex-1 rounded-3xl bg-card px-4 py-2 text-foreground"
              placeholder="Tulis komentar..."
              placeholderTextColor={isDarkColorScheme ? '#71767B' : '#536471'}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={280}
              style={{
                maxHeight: 100,
                color: isDarkColorScheme ? '#E7E9EA' : '#0F1419',
                fontSize: 16,
                lineHeight: 22,
              }}
              textAlignVertical="center"
            />
            <TouchableOpacity
              className={`rounded-full bg-primary px-4 py-2 ${
                !newComment.trim() ? 'opacity-50' : ''
              }${loading ? 'opacity-50' : ''}`}
              disabled={!newComment.trim() || loading}
              onPress={onNewComment}>
              {loading ? (
                <Loading size={'small'} />
              ) : (
                <Text className="text-primary-foreground">Kirim</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CommentModal;
