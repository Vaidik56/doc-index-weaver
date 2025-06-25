
import { useState, useCallback } from 'react';
import { SubField } from './useIndexManagement';
import { toast } from '@/hooks/use-toast';

// Mock sub-field library data
const initialSubFields: SubField[] = [
  {
    id: 'sf1',
    name: 'Invoice Number',
    fieldType: 'text',
    isRequired: true,
    validations: [
      { type: 'required', message: 'Invoice number is required' },
      { type: 'minLength', value: '5', message: 'Invoice number must be at least 5 characters' }
    ],
    usageCount: 12,
    description: 'Standard invoice identification number'
  },
  {
    id: 'sf2',
    name: 'Invoice Date',
    fieldType: 'date',
    isRequired: true,
    validations: [
      { type: 'required', message: 'Invoice date is required' }
    ],
    usageCount: 15,
    description: 'Date when invoice was issued'
  },
  {
    id: 'sf3',
    name: 'Customer Name',
    fieldType: 'text',
    isRequired: true,
    validations: [
      { type: 'required', message: 'Customer name is required' },
      { type: 'maxLength', value: '100', message: 'Customer name cannot exceed 100 characters' }
    ],
    usageCount: 8,
    description: 'Name of the customer or client'
  },
  {
    id: 'sf4',
    name: 'Amount',
    fieldType: 'number',
    isRequired: true,
    validations: [
      { type: 'required', message: 'Amount is required' },
      { type: 'min', value: '0', message: 'Amount must be positive' }
    ],
    usageCount: 10,
    description: 'Total amount of the invoice'
  }
];

export const useSubFieldLibrary = () => {
  const [subFields, setSubFields] = useState<SubField[]>(initialSubFields);
  const [isLoading, setIsLoading] = useState(false);

  const createSubField = useCallback(async (subFieldData: Omit<SubField, 'id' | 'usageCount'>) => {
    setIsLoading(true);
    try {
      const newSubField: SubField = {
        ...subFieldData,
        id: `sf_${Date.now()}`,
        usageCount: 0
      };
      
      setSubFields(prev => [...prev, newSubField]);
      
      toast({
        title: "Sub-field created successfully",
        description: `${newSubField.name} has been added to the library.`
      });
      
      return newSubField;
    } catch (error) {
      toast({
        title: "Error creating sub-field",
        description: "Failed to create the sub-field. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSubField = useCallback(async (id: string, subFieldData: Partial<SubField>) => {
    setIsLoading(true);
    try {
      setSubFields(prev => prev.map(subField => 
        subField.id === id ? { ...subField, ...subFieldData } : subField
      ));
      
      toast({
        title: "Sub-field updated successfully",
        description: `${subFieldData.name || 'Sub-field'} has been updated.`
      });
    } catch (error) {
      toast({
        title: "Error updating sub-field",
        description: "Failed to update the sub-field. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSubField = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const subFieldToDelete = subFields.find(sf => sf.id === id);
      setSubFields(prev => prev.filter(subField => subField.id !== id));
      
      toast({
        title: "Sub-field deleted successfully",
        description: `${subFieldToDelete?.name || 'Sub-field'} has been deleted.`
      });
    } catch (error) {
      toast({
        title: "Error deleting sub-field",
        description: "Failed to delete the sub-field. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [subFields]);

  const incrementUsage = useCallback((id: string) => {
    setSubFields(prev => prev.map(subField => 
      subField.id === id 
        ? { ...subField, usageCount: (subField.usageCount || 0) + 1 }
        : subField
    ));
  }, []);

  return {
    subFields,
    isLoading,
    createSubField,
    updateSubField,
    deleteSubField,
    incrementUsage
  };
};
