
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndexList } from '@/components/index-management/IndexList';
import { SubFieldLibrary } from '@/components/index-management/SubFieldLibrary';

const IndexManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Index Management</h1>
        <p className="text-muted-foreground">
          Manage document indexes, sub-fields, and validation rules for your DMS
        </p>
      </div>

      <Tabs defaultValue="indexes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="indexes">Index Management</TabsTrigger>
          <TabsTrigger value="subfields">Sub-Field Library</TabsTrigger>
        </TabsList>

        <TabsContent value="indexes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Indexes</CardTitle>
              <CardDescription>
                Create and manage custom indexes for your document management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IndexList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subfields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sub-Field Library</CardTitle>
              <CardDescription>
                Manage reusable sub-fields that can be used across multiple indexes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubFieldLibrary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndexManagement;
