
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export interface Validation {
  type: string;
  value?: string;
  message?: string;
}

interface ValidationBuilderProps {
  validations: Validation[];
  onChange: (validations: Validation[]) => void;
  fieldType: string;
}

const ValidationBuilder: React.FC<ValidationBuilderProps> = ({
  validations,
  onChange,
  fieldType
}) => {
  const getValidationOptions = (fieldType: string) => {
    const commonValidations = [
      { value: 'required', label: 'Required', hasValue: false },
    ];

    const typeSpecificValidations: Record<string, any[]> = {
      text: [
        { value: 'minLength', label: 'Minimum Length', hasValue: true },
        { value: 'maxLength', label: 'Maximum Length', hasValue: true },
        { value: 'pattern', label: 'Pattern (Regex)', hasValue: true },
      ],
      number: [
        { value: 'min', label: 'Minimum Value', hasValue: true },
        { value: 'max', label: 'Maximum Value', hasValue: true },
      ],
      email: [
        { value: 'email', label: 'Valid Email Format', hasValue: false },
      ],
      date: [
        { value: 'minDate', label: 'Minimum Date', hasValue: true },
        { value: 'maxDate', label: 'Maximum Date', hasValue: true },
      ],
    };

    return [...commonValidations, ...(typeSpecificValidations[fieldType] || [])];
  };

  const addValidation = () => {
    const newValidation: Validation = {
      type: 'required',
      message: 'This field is required'
    };
    onChange([...validations, newValidation]);
  };

  const updateValidation = (index: number, field: keyof Validation, value: string) => {
    const updated = validations.map((validation, i) => 
      i === index ? { ...validation, [field]: value } : validation
    );
    onChange(updated);
  };

  const removeValidation = (index: number) => {
    onChange(validations.filter((_, i) => i !== index));
  };

  const validationOptions = getValidationOptions(fieldType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Validation Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validations.map((validation, index) => (
          <div key={index} className="flex gap-3 items-end p-3 border rounded-md">
            <div className="flex-1">
              <Label className="text-sm">Validation Type</Label>
              <Select
                value={validation.type}
                onValueChange={(value) => updateValidation(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {validationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {validationOptions.find(opt => opt.value === validation.type)?.hasValue && (
              <div className="flex-1">
                <Label className="text-sm">Value</Label>
                <Input
                  value={validation.value || ''}
                  onChange={(e) => updateValidation(index, 'value', e.target.value)}
                  placeholder="Enter validation value"
                />
              </div>
            )}

            <div className="flex-1">
              <Label className="text-sm">Error Message</Label>
              <Input
                value={validation.message || ''}
                onChange={(e) => updateValidation(index, 'message', e.target.value)}
                placeholder="Enter error message"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeValidation(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addValidation}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Validation Rule
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValidationBuilder;
