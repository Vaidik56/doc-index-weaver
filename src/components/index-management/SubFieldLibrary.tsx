
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SubField {
  id: string;
  name: string;
  fieldType: string;
  description: string;
  isRequired: boolean;
  validations: any[];
  usageCount: number;
  createdAt: string;
}

// Mock data
const mockSubFields: SubField[] = [
  {
    id: 'sf1',
    name: 'Invoice Number',
    fieldType: 'text',
    description: 'Standard invoice identification number',
    isRequired: true,
    validations: [{ type: 'required' }, { type: 'minLength', value: '5' }],
    usageCount: 12,
    createdAt: '2024-01-15'
  },
  {
    id: 'sf2',
    name: 'Invoice Date',
    fieldType: 'date',
    description: 'Date when invoice was issued',
    isRequired: true,
    validations: [{ type: 'required' }],
    usageCount: 15,
    createdAt: '2024-01-14'
  },
  {
    id: 'sf3',
    name: 'Customer Name',
    fieldType: 'text',
    description: 'Name of the customer or client',
    isRequired: true,
    validations: [{ type: 'required' }, { type: 'maxLength', value: '100' }],
    usageCount: 8,
    createdAt: '2024-01-13'
  }
];

export const SubFieldLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subFields] = useState<SubField[]>(mockSubFields);

  const filteredSubFields = subFields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.fieldType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Sub-Field Library</h3>
          <p className="text-sm text-muted-foreground">
            {subFields.length} reusable sub-fields available
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Sub-Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Sub-Field</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8 text-muted-foreground">
              Sub-field creation form would go here
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sub-fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredSubFields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sub-fields found matching your search.
          </div>
        ) : (
          filteredSubFields.map((field) => (
            <Card key={field.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {field.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Used {field.usageCount}x
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {field.fieldType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-wrap">
                    {field.isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {field.validations.map((validation, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {validation.type}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" disabled={field.usageCount > 0}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Created {field.createdAt}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
