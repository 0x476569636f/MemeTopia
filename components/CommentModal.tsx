import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './nativewindui/Text';
import Avatar from './Avatar';
import { formatDate } from '~/functions/Date';
import { useColorScheme } from '~/lib/useColorScheme';

interface CommentModalProps {
  isVisible: boolean;
  onClose: () => void;
  post: any;
  currentUser: any;
}

// Fake comment data
const fakeComments = [
  {
    id: 1,
    text: 'Great post! 👍',
    user: {
      id: 1,
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    created_at: new Date().toISOString(),
    likes: 5,
  },
  {
    id: 2,
    text: 'Thanks for sharing this!',
    user: {
      id: 2,
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: 3,
  },
  // Add more fake comments as needed
];

const CommentModal: React.FC<CommentModalProps> = ({ isVisible, onClose, post, currentUser }) => {
  const { isDarkColorScheme } = useColorScheme();
  const [newComment, setNewComment] = useState('');

  const renderComment = ({ item }: { item: any }) => (
    <View className="border-b border-border p-4">
      <View className="flex-row">
        <Avatar size={40} uri={item.user.image} />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold">{item.user.name}</Text>
            <Text className="ml-2 text-xs text-muted-foreground">
              {formatDate(item.created_at)}
            </Text>
          </View>
          <Text className="mt-1">{item.text}</Text>
          <View className="mt-2 flex-row items-center space-x-6">
            <TouchableOpacity className="flex-row items-center">
              <Feather
                name="heart"
                size={16}
                color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
              />
              <Text className="ml-1 text-xs text-muted-foreground">{item.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border p-4">
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'} />
          </TouchableOpacity>
          <Text className="mt-2 text-xl font-bold">Comments</Text>
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
          data={fakeComments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
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
              placeholder="Add a comment..."
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
              }`}
              disabled={!newComment.trim()}>
              <Text className="text-primary-foreground">Kirim</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CommentModal;
