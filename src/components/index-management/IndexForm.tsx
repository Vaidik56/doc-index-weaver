
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Search } from 'lucide-react';
import { SubFieldSelector } from './SubFieldSelector';
import { ValidationBuilder } from './ValidationBuilder';
import { toast } from '@/hooks/use-toast';

interface SubField {
  id: string;
  name: string;
  fieldType: string;
  isRequired: boolean;
  validations: Validation[];
  isExisting?: boolean;
}

interface Validation {
  type: string;
  value?: string;
  message: string;
}

interface IndexFormData {
  name: string;
  description: string;
  subFields: SubField[];
}

interface IndexFormProps {
  initialData?: any;
  onClose: () => void;
}

export const IndexForm = ({ initialData, onClose }: IndexFormProps) => {
  const [showSubFieldSelector, setShowSubFieldSelector] = useState(false);
  const [editingSubField, setEditingSubField] = useState<SubField | null>(null);

  const { control, register, handleSubmit, watch, setValue } = useForm<IndexFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      subFields: initialData?.subFields || []
    }
  });

  const { fields: subFields, append, remove, update } = useFieldArray({
    control,
    name: 'subFields'
  });

  const addExistingSubField = (subField: SubField) => {
    append({ ...subField, isExisting: true });
    setShowSubFieldSelector(false);
  };

  const addNewSubField = () => {
    const newSubField: SubField = {
      id: `new_${Date.now()}`,
      name: '',
      fieldType: 'text',
      isRequired: false,
      validations: [],
      isExisting: false
    };
    append(newSubField);
  };

  const onSubmit = (data: IndexFormData) => {
    console.log('Submitting index:', data);
    toast({
      title: "Index saved successfully",
      description: `${data.name} has been ${initialData ? 'updated' : 'created'}.`
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Index Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Index name is required' })}
            placeholder="e.g., Invoice Index"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe what this index is used for..."
            rows={3}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Sub-Fields</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSubFieldSelector(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Add Existing
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewSubField}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subFields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sub-fields added yet. Add existing fields or create new ones.
            </div>
          ) : (
            subFields.map((field, index) => (
              <SubFieldCard
                key={field.id}
                field={field}
                index={index}
                onEdit={() => setEditingSubField(field)}
                onRemove={() => remove(index)}
                onUpdate={(updatedField) => update(index, updatedField)}
              />
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Index' : 'Create Index'}
        </Button>
      </div>

      {showSubFieldSelector && (
        <SubFieldSelector
          onSelect={addExistingSubField}
          onClose={() => setShowSubFieldSelector(false)}
        />
      )}
    </form>
  );
};

interface SubFieldCardProps {
  field: SubField;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
  onUpdate: (field: SubField) => void;
}

const SubFieldCard = ({ field, index, onEdit, onRemove, onUpdate }: SubFieldCardProps) => {
  const [isEditing, setIsEditing] = useState(!field.name);
  const [localField, setLocalField] = useState(field);

  const handleSave = () => {
    onUpdate(localField);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Name</Label>
                <Input
                  value={localField.name}
                  onChange={(e) => setLocalField({...localField, name: e.target.value})}
                  placeholder="e.g., Invoice Number"
                />
              </div>
              <div>
                <Label>Field Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={localField.fieldType}
                  onChange={(e) => setLocalField({...localField, fieldType: e.target.value})}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                  <option value="boolean">Yes/No</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>
            </div>
            
            <ValidationBuilder
              validations={localField.validations}
              onChange={(validations) => setLocalField({...localField, validations})}
              fieldType={localField.fieldType}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{field.name}</h4>
              {field.isExisting && (
                <Badge variant="secondary" className="text-xs">
                  Reused
                </Badge>
              )}
              {field.isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              Type: {field.fieldType}
            </p>
            {field.validations.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {field.validations.map((validation, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {validation.type}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
