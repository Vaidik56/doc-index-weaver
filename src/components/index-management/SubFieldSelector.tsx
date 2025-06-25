
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface SubField {
  id: string;
  name: string;
  fieldType: string;
  isRequired: boolean;
  validations: any[];
  usageCount: number;
  description?: string;
}

// Mock existing sub-fields
const mockSubFields: SubField[] = [
  {
    id: 'sf1',
    name: 'Invoice Number',
    fieldType: 'text',
    isRequired: true,
    validations: [{ type: 'required' }, { type: 'minLength', value: '5' }],
    usageCount: 12,
    description: 'Standard invoice identification number'
  },
  {
    id: 'sf2',
    name: 'Invoice Date',
    fieldType: 'date',
    isRequired: true,
    validations: [{ type: 'required' }],
    usageCount: 15,
    description: 'Date when invoice was issued'
  },
  {
    id: 'sf3',
    name: 'Customer Name',
    fieldType: 'text',
    isRequired: true,
    validations: [{ type: 'required' }, { type: 'maxLength', value: '100' }],
    usageCount: 8,
    description: 'Name of the customer or client'
  },
  {
    id: 'sf4',
    name: 'Total Amount',
    fieldType: 'number',
    isRequired: true,
    validations: [{ type: 'required' }, { type: 'min', value: '0' }],
    usageCount: 10,
    description: 'Total invoice amount'
  }
];

interface SubFieldSelectorProps {
  onSelect: (subField: SubField) => void;
  onClose: () => void;
}

export const SubFieldSelector = ({ onSelect, onClose }: SubFieldSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subFields] = useState<SubField[]>(mockSubFields);

  const filteredSubFields = subFields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.fieldType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Existing Sub-Field</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sub-fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSubFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sub-fields found matching your search.
              </div>
            ) : (
              filteredSubFields.map((field) => (
                <Card 
                  key={field.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelect(field)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{field.name}</CardTitle>
                        {field.description && (
                          <CardDescription className="text-xs mt-1">
                            {field.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Used {field.usageCount}x
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {field.fieldType}
                        </Badge>
                        {field.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {field.validations.slice(0, 2).map((validation, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {validation.type}
                          </Badge>
                        ))}
                        {field.validations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{field.validations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
