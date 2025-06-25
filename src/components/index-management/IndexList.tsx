
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Settings } from 'lucide-react';
import { IndexForm } from './IndexForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Index {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
  isActive: boolean;
  createdAt: string;
}

// Mock data - replace with actual data fetching
const mockIndexes: Index[] = [
  {
    id: '1',
    name: 'Invoice Index',
    description: 'Standard invoice indexing fields',
    fieldCount: 5,
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Contract Index',
    description: 'Legal contract document fields',
    fieldCount: 8,
    isActive: true,
    createdAt: '2024-01-10'
  }
];

export const IndexList = () => {
  const [indexes] = useState<Index[]>(mockIndexes);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<Index | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Active Indexes</h3>
          <p className="text-sm text-muted-foreground">
            {indexes.length} indexes configured
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Index
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Index</DialogTitle>
            </DialogHeader>
            <IndexForm onClose={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {indexes.map((index) => (
          <Card key={index.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{index.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {index.description}
                  </CardDescription>
                </div>
                <Badge variant={index.isActive ? "default" : "secondary"}>
                  {index.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {index.fieldCount} fields • Created {index.createdAt}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Index: {index.name}</DialogTitle>
                      </DialogHeader>
                      <IndexForm 
                        initialData={index} 
                        onClose={() => setEditingIndex(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
