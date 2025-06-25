
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Settings, Trash2, Power } from 'lucide-react';
import { IndexForm } from './IndexForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIndexManagement } from '@/hooks/useIndexManagement';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const IndexList = () => {
  const { indexes, isLoading, deleteIndex, toggleIndexStatus } = useIndexManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteIndex(id);
    } catch (error) {
      console.error('Failed to delete index:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleIndexStatus(id);
    } catch (error) {
      console.error('Failed to toggle index status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">Loading indexes...</div>
      </div>
    );
  }

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
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(index.id)}
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Index</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{index.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(index.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
