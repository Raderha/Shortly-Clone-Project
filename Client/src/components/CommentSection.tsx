import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { getComments, createComment, deleteComment } from '../api/comment';
import { CommentResponse } from '../api/types';
import { useAuth } from '../contexts/AuthContext';

interface CommentSectionProps {
  videoId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(videoId, token);
      setComments(fetchedComments);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const createdComment = await createComment({
        content: newComment.trim(),
        videoId,
      }, token);

      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
    } catch (error) {
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    Alert.alert(
      '댓글 삭제',
      '정말로 이 댓글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId, token);
              setComments(prev => prev.filter(c => c.id !== commentId));
            } catch (error) {
              Alert.alert('오류', '댓글 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderComment = ({ item }: { item: CommentResponse }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      {item.isOwner && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteComment(item.id)}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>댓글</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="댓글을 입력하세요..."
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitComment}
        >
          <Text style={styles.submitButtonText}>작성</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadComments}
        style={styles.commentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentList: {
    maxHeight: 400,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 12,
  },
}); 