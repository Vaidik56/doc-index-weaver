
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useIndexManagement, type Index } from './useIndexManagement';

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  indexIds: string[];
  createdAt: string;
}

// Mock data - replace with actual API calls when backend is ready
const initialDocumentTypes: DocumentType[] = [
  {
    id: 'dt_1',
    name: 'Legal Documents',
    description: 'Contracts, agreements, and legal paperwork',
    indexIds: ['2'], // Contract Index
    createdAt: '2024-01-15'
  },
  {
    id: 'dt_2',
    name: 'Financial Records',
    description: 'Invoices, receipts, and financial statements',
    indexIds: ['1'], // Invoice Index
    createdAt: '2024-01-12'
  },
  {
    id: 'dt_3',
    name: 'Mixed Business Documents',
    description: 'Documents requiring both legal and financial indexing',
    indexIds: ['1', '2'], // Both Invoice and Contract indexes
    createdAt: '2024-01-10'
  }
];

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(initialDocumentTypes);
  const [isLoading, setIsLoading] = useState(false);
  const { indexes } = useIndexManagement();

  const createDocumentType = useCallback(async (documentTypeData: Omit<DocumentType, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const newDocumentType: DocumentType = {
        ...documentTypeData,
        id: `dt_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setDocumentTypes(prev => [...prev, newDocumentType]);
      
      toast({
        title: "Document type created successfully",
        description: `${newDocumentType.name} has been created.`
      });
      
      return newDocumentType;
    } catch (error) {
      toast({
        title: "Error creating document type",
        description: "Failed to create the document type. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getIndexesForDocumentType = useCallback((documentTypeId: string): Index[] => {
    const documentType = documentTypes.find(dt => dt.id === documentTypeId);
    if (!documentType) return [];
    
    return indexes.filter(index => documentType.indexIds.includes(index.id));
  }, [documentTypes, indexes]);

  const getAllFieldsForDocumentType = useCallback((documentTypeId: string) => {
    const associatedIndexes = getIndexesForDocumentType(documentTypeId);
    const allFields = associatedIndexes.flatMap(index => 
      index.subFields.map(field => ({
        ...field,
        indexName: index.name,
        indexId: index.id
      }))
    );
    return allFields;
  }, [getIndexesForDocumentType]);

  return {
    documentTypes,
    isLoading,
    createDocumentType,
    getIndexesForDocumentType,
    getAllFieldsForDocumentType
  };
};
