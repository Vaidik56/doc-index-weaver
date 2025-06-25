
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface SubField {
  id: string;
  name: string;
  fieldType: string;
  isRequired: boolean;
  validations: Validation[];
  isExisting?: boolean;
  usageCount?: number;
  description?: string;
}

export interface Validation {
  type: string;
  value?: string;
  message?: string;
}

export interface Index {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
  isActive: boolean;
  createdAt: string;
  subFields: SubField[];
}

// Mock data - replace with actual API calls when backend is ready
const initialIndexes: Index[] = [
  {
    id: '1',
    name: 'Invoice Index',
    description: 'Standard invoice indexing fields',
    fieldCount: 5,
    isActive: true,
    createdAt: '2024-01-15',
    subFields: []
  },
  {
    id: '2',
    name: 'Contract Index',
    description: 'Legal contract document fields',
    fieldCount: 8,
    isActive: true,
    createdAt: '2024-01-10',
    subFields: []
  }
];

export const useIndexManagement = () => {
  const [indexes, setIndexes] = useState<Index[]>(initialIndexes);
  const [isLoading, setIsLoading] = useState(false);

  const createIndex = useCallback(async (indexData: Omit<Index, 'id' | 'createdAt' | 'fieldCount'>) => {
    setIsLoading(true);
    try {
      const newIndex: Index = {
        ...indexData,
        id: `idx_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        fieldCount: indexData.subFields.length
      };
      
      setIndexes(prev => [...prev, newIndex]);
      
      toast({
        title: "Index created successfully",
        description: `${newIndex.name} has been created with ${newIndex.fieldCount} fields.`
      });
      
      return newIndex;
    } catch (error) {
      toast({
        title: "Error creating index",
        description: "Failed to create the index. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateIndex = useCallback(async (id: string, indexData: Partial<Index>) => {
    setIsLoading(true);
    try {
      setIndexes(prev => prev.map(index => 
        index.id === id 
          ? { 
              ...index, 
              ...indexData, 
              fieldCount: indexData.subFields ? indexData.subFields.length : index.fieldCount 
            }
          : index
      ));
      
      toast({
        title: "Index updated successfully",
        description: `${indexData.name || 'Index'} has been updated.`
      });
    } catch (error) {
      toast({
        title: "Error updating index",
        description: "Failed to update the index. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteIndex = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const indexToDelete = indexes.find(idx => idx.id === id);
      setIndexes(prev => prev.filter(index => index.id !== id));
      
      toast({
        title: "Index deleted successfully",
        description: `${indexToDelete?.name || 'Index'} has been deleted.`
      });
    } catch (error) {
      toast({
        title: "Error deleting index",
        description: "Failed to delete the index. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [indexes]);

  const toggleIndexStatus = useCallback(async (id: string) => {
    const index = indexes.find(idx => idx.id === id);
    if (index) {
      await updateIndex(id, { isActive: !index.isActive });
    }
  }, [indexes, updateIndex]);

  return {
    indexes,
    isLoading,
    createIndex,
    updateIndex,
    deleteIndex,
    toggleIndexStatus
  };
};
