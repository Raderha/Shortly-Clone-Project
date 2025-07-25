import { useState } from 'react';

export const useTagSelection = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagPress = async (
    tagName: string,
    searchByTagFunction: (tagName: string) => Promise<void>,
    loadVideosFunction: () => Promise<void>
  ) => {
    if (selectedTag === tagName) {
      // 같은 태그를 다시 누르면 전체 영상으로 돌아가기
      setSelectedTag(null);
      await loadVideosFunction();
    } else {
      // 새로운 태그 선택
      setSelectedTag(tagName);
      await searchByTagFunction(tagName);
    }
  };

  const clearSelectedTag = () => {
    setSelectedTag(null);
  };

  return {
    selectedTag,
    handleTagPress,
    clearSelectedTag,
    setSelectedTag,
  };
}; 