import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getComments, createComment, updateComment, deleteComment } from '../api/comment';
import { CommentResponse } from '../api/types';
import { useAuth } from '../contexts/AuthContext';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: number;
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, videoId }) => {
  const { token } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentResponse | null>(null);
  const [editText, setEditText] = useState('');

  // 댓글 목록 가져오기
  const fetchComments = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await getComments(videoId, token);
      setComments(response);
    } catch (error) {
      console.error('댓글 가져오기 실패:', error);
      Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [videoId, token]);

  // 모달이 열릴 때 댓글 가져오기
  useEffect(() => {
    if (visible && token) {
      fetchComments();
    } else if (!visible) {
      // 모달이 닫힐 때 댓글 목록 초기화
      setComments([]);
      setNewComment('');
      setEditingComment(null);
      setEditText('');
    }
  }, [visible, token, videoId, fetchComments]);

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!token) {
      Alert.alert('로그인 필요', '댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await createComment({
        content: newComment.trim(),
        videoId: videoId,
      }, token);

      setComments(prev => [response, ...prev]);
      setNewComment('');
      Alert.alert('성공', '댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (comment: CommentResponse) => {
    if (!token || !comment.isOwner) return;

    if (!editText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateComment(comment.id, {
        content: editText.trim(),
        videoId: videoId,
      }, token);

      setComments(prev => prev.map(c => c.id === comment.id ? response : c));
      setEditingComment(null);
      setEditText('');
      Alert.alert('성공', '댓글이 수정되었습니다.');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      Alert.alert('오류', '댓글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (comment: CommentResponse) => {
    if (!token || !comment.isOwner) return;

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
              setSubmitting(true);
              await deleteComment(comment.id, token);
              setComments(prev => prev.filter(c => c.id !== comment.id));
              Alert.alert('성공', '댓글이 삭제되었습니다.');
            } catch (error) {
              console.error('댓글 삭제 실패:', error);
              Alert.alert('오류', '댓글 삭제에 실패했습니다.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // 댓글 수정 모드 시작
  const startEditComment = (comment: CommentResponse) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  // 댓글 수정 모드 취소
  const cancelEditComment = () => {
    setEditingComment(null);
    setEditText('');
  };

  const renderComment = ({ item }: { item: CommentResponse }) => {
    const isEditing = editingComment?.id === item.id;

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.user.username}</Text>
          <Text style={styles.commentDate}>
            {new Date(item.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="댓글을 수정하세요..."
              multiline
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditComment(item)}
                disabled={submitting}
              >
                <Text style={styles.editButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={cancelEditComment}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.commentContent}>
            <Text style={styles.commentText}>{item.content}</Text>
            {item.isOwner && (
              <View style={styles.commentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => startEditComment(item)}
                >
                  <Text style={styles.actionButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteComment(item)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>댓글</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 댓글 목록 */}
        <View style={styles.commentsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B57" />
              <Text style={styles.loadingText}>댓글을 불러오는 중...</Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>아직 댓글이 없습니다.</Text>
              <Text style={styles.emptySubText}>첫 번째 댓글을 작성해보세요!</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.commentsList}
            />
          )}
        </View>

        {/* 댓글 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="댓글을 입력하세요..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.submitButton, (!newComment.trim() || submitting) && styles.submitButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>작성</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  commentsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#FF6B57',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B57',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CommentModal; 