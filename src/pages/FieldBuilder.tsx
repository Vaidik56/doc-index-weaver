
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import ValidationBuilder, { type Validation } from '@/components/index-management/ValidationBuilder';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FieldConfiguration {
  name: string;
  fieldType: string;
  description: string;
  isRequired: boolean;
  validations: Validation[];
}

const FieldBuilder = () => {
  const [fieldConfig, setFieldConfig] = useState<FieldConfiguration>({
    name: '',
    fieldType: 'text',
    description: '',
    isRequired: false,
    validations: []
  });

  const [showValidationBuilder, setShowValidationBuilder] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'date', label: 'Date' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  const handleFieldChange = (field: keyof FieldConfiguration, value: any) => {
    setFieldConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleValidationsChange = (validations: Validation[]) => {
    setFieldConfig(prev => ({
      ...prev,
      validations
    }));
  };

  const handleSave = () => {
    if (!fieldConfig.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Field name is required",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to your data store
    toast({
      title: "Field Saved",
      description: `Field "${fieldConfig.name}" has been saved successfully.`
    });

    // Reset form
    setFieldConfig({
      name: '',
      fieldType: 'text',
      description: '',
      isRequired: false,
      validations: []
    });
    setShowValidationBuilder(false);
  };

  const handleReset = () => {
    setFieldConfig({
      name: '',
      fieldType: 'text',
      description: '',
      isRequired: false,
      validations: []
    });
    setShowValidationBuilder(false);
  };

  const renderFieldPreview = () => {
    const commonProps = {
      placeholder: fieldConfig.description || `Enter ${fieldConfig.name || 'field name'}`,
      disabled: true
    };

    switch (fieldConfig.fieldType) {
      case 'text':
        return <Input {...commonProps} />;
      case 'number':
        return <Input type="number" {...commonProps} />;
      case 'email':
        return <Input type="email" {...commonProps} />;
      case 'date':
        return <Input type="date" {...commonProps} />;
      case 'textarea':
        return <Textarea {...commonProps} />;
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled className="rounded" />
            <Label className="text-sm text-muted-foreground">
              {fieldConfig.name || 'Checkbox option'}
            </Label>
          </div>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Field Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Create and configure custom fields with validation rules
        </p>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Field Settings - Left Column */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Field Settings</CardTitle>
              <CardDescription>
                Configure the basic properties of your field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="field-type">Field Type</Label>
                <Select
                  value={fieldConfig.fieldType}
                  onValueChange={(value) => handleFieldChange('fieldType', value)}
                >
                  <SelectTrigger id="field-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-name">Field Name</Label>
                <Input
                  id="field-name"
                  value={fieldConfig.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Enter field name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-description">Description</Label>
                <Textarea
                  id="field-description"
                  value={fieldConfig.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Enter field description or placeholder text"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={fieldConfig.isRequired}
                  onCheckedChange={(checked) => handleFieldChange('isRequired', checked)}
                />
                <Label htmlFor="required">Required field</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview - Right Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your field will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    {fieldConfig.name || 'Field Name'}
                    {fieldConfig.isRequired && <span className="text-red-500">*</span>}
                  </Label>
                  {renderFieldPreview()}
                </div>
                
                {fieldConfig.description && (
                  <p className="text-sm text-muted-foreground">
                    {fieldConfig.description}
                  </p>
                )}

                {fieldConfig.validations.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Validation Rules:</Label>
                    <div className="flex flex-wrap gap-1">
                      {fieldConfig.validations.map((validation, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {validation.type}
                          {validation.value && `: ${validation.value}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Validation Builder Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validation Rules</CardTitle>
              <CardDescription>
                Configure validation rules for your field
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowValidationBuilder(!showValidationBuilder)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {showValidationBuilder ? 'Hide' : 'Add'} Validations
            </Button>
          </div>
        </CardHeader>
        
        {showValidationBuilder && (
          <CardContent>
            <ValidationBuilder
              validations={fieldConfig.validations}
              onChange={handleValidationsChange}
              fieldType={fieldConfig.fieldType}
            />
          </CardContent>
        )}

        {fieldConfig.validations.length > 0 && !showValidationBuilder && (
          <CardContent>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current Validation Rules:</Label>
              {fieldConfig.validations.map((validation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium capitalize">{validation.type}</span>
                    {validation.value && (
                      <span className="text-muted-foreground ml-2">
                        Value: {validation.value}
                      </span>
                    )}
                    {validation.message && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {validation.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Field
        </Button>
      </div>
    </div>
  );
};

export default FieldBuilder;
