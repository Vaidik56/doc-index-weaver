
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Validation {
  type: string;
  value?: string;
  message: string;
}

interface ValidationBuilderProps {
  validations: Validation[];
  onChange: (validations: Validation[]) => void;
  fieldType: string;
}

const validationTypes = {
  text: [
    { type: 'required', label: 'Required', hasValue: false },
    { type: 'minLength', label: 'Minimum Length', hasValue: true },
    { type: 'maxLength', label: 'Maximum Length', hasValue: true },
    { type: 'pattern', label: 'Pattern (Regex)', hasValue: true }
  ],
  number: [
    { type: 'required', label: 'Required', hasValue: false },
    { type: 'min', label: 'Minimum Value', hasValue: true },
    { type: 'max', label: 'Maximum Value', hasValue: true }
  ],
  email: [
    { type: 'required', label: 'Required', hasValue: false },
    { type: 'email', label: 'Valid Email', hasValue: false }
  ],
  date: [
    { type: 'required', label: 'Required', hasValue: false },
    { type: 'minDate', label: 'Minimum Date', hasValue: true },
    { type: 'maxDate', label: 'Maximum Date', hasValue: true }
  ],
  boolean: [
    { type: 'required', label: 'Required', hasValue: false }
  ],
  select: [
    { type: 'required', label: 'Required', hasValue: false }
  ]
};

export const ValidationBuilder = ({ validations, onChange, fieldType }: ValidationBuilderProps) => {
  const [showAddValidation, setShowAddValidation] = useState(false);
  const [newValidation, setNewValidation] = useState<Partial<Validation>>({});

  const availableValidations = validationTypes[fieldType as keyof typeof validationTypes] || [];

  const addValidation = () => {
    if (newValidation.type) {
      const validation: Validation = {
        type: newValidation.type,
        value: newValidation.value || '',
        message: newValidation.message || `${newValidation.type} validation failed`
      };
      onChange([...validations, validation]);
      setNewValidation({});
      setShowAddValidation(false);
    }
  };

  const removeValidation = (index: number) => {
    onChange(validations.filter((_, i) => i !== index));
  };

  const hasValidationType = (type: string) => {
    return validations.some(v => v.type === type);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Validations</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddValidation(!showAddValidation)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Validation
        </Button>
      </div>

      {validations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {validations.map((validation, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {validation.type}
              {validation.value && `: ${validation.value}`}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 hover:bg-transparent"
                onClick={() => removeValidation(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {showAddValidation && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Add New Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Validation Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newValidation.type || ''}
                onChange={(e) => setNewValidation({...newValidation, type: e.target.value})}
              >
                <option value="">Select validation type</option>
                {availableValidations
                  .filter(v => !hasValidationType(v.type))
                  .map((validation) => (
                    <option key={validation.type} value={validation.type}>
                      {validation.label}
                    </option>
                  ))}
              </select>
            </div>

            {newValidation.type && 
             availableValidations.find(v => v.type === newValidation.type)?.hasValue && (
              <div>
                <Label>Value</Label>
                <Input
                  value={newValidation.value || ''}
                  onChange={(e) => setNewValidation({...newValidation, value: e.target.value})}
                  placeholder="Enter validation value"
                />
              </div>
            )}

            <div>
              <Label>Error Message</Label>
              <Input
                value={newValidation.message || ''}
                onChange={(e) => setNewValidation({...newValidation, message: e.target.value})}
                placeholder="Custom error message (optional)"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewValidation({});
                  setShowAddValidation(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addValidation}
                disabled={!newValidation.type}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
