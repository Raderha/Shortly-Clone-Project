import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';

interface TagModalProps {
  visible: boolean;
  newTagName: string;
  onNewTagNameChange: (text: string) => void;
  onAddTag: () => void;
  onClose: () => void;
}

export const TagModal: React.FC<TagModalProps> = ({
  visible,
  newTagName,
  onNewTagNameChange,
  onAddTag,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>즐겨찾기 태그 추가</Text>
          <TextInput
            style={styles.tagInput}
            placeholder="태그 이름을 입력하세요"
            value={newTagName}
            onChangeText={onNewTagNameChange}
            autoFocus={true}
            onSubmitEditing={onAddTag}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.addButton]} 
              onPress={onAddTag}
            >
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tagInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B57',
    borderWidth: 1,
    borderColor: '#FF6B57',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 