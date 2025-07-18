
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, FileText, Plus, Search, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Document Management System</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manage your documents with custom indexing, validation rules, and flexible field configurations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Upload and manage documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload, categorize, and search through your document collection with custom indexes.
              </p>
              <Link to="/documents">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Index Management</CardTitle>
                  <CardDescription>Configure document indexes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create custom indexes with sub-fields, validation rules, and reusable components.
              </p>
              <Link to="/index-management">
                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Indexes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Field Builder</CardTitle>
                  <CardDescription>Create custom fields</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Build custom fields with validation rules and real-time preview.
              </p>
              <Link to="/field-builder">
                <Button className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  Build Fields
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Search & Reports</CardTitle>
                  <CardDescription>Find and analyze documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced search capabilities and comprehensive reporting tools.
              </p>
              <Button className="w-full" disabled>
                <Search className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Begin by setting up your document indexes to define how your documents will be categorized and validated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 justify-center">
                <Link to="/index-management">
                  <Button size="lg" className="font-semibold">
                    Configure Indexes
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button size="lg" variant="outline" className="font-semibold">
                    Upload Documents
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
