import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';

interface SearchModalProps {
  visible: boolean;
  searchKeyword: string;
  onSearchKeywordChange: (text: string) => void;
  onSearch: () => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  searchKeyword,
  onSearchKeywordChange,
  onSearch,
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
          <Text style={styles.modalTitle}>영상 검색</Text>
          <TextInput
            style={styles.tagInput}
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChangeText={onSearchKeywordChange}
            autoFocus={true}
            onSubmitEditing={onSearch}
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
              onPress={onSearch}
            >
              <Text style={styles.addButtonText}>검색</Text>
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