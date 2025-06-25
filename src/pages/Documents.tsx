
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { useIndexManagement } from '@/hooks/useIndexManagement';
import { toast } from '@/hooks/use-toast';

interface DocumentData {
  [key: string]: string | number;
}

interface UploadedDocument {
  id: string;
  name: string;
  file: File;
  indexId: string;
  data: DocumentData;
  uploadedAt: Date;
}

const Documents = () => {
  const { indexes } = useIndexManagement();
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [documentData, setDocumentData] = useState<DocumentData>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    const numericValue = value && !isNaN(Number(value)) ? Number(value) : value;
    setDocumentData(prev => ({
      ...prev,
      [fieldName]: numericValue
    }));
  };

  const validateDocument = () => {
    const selectedIndexData = indexes.find(idx => idx.id === selectedIndex);
    if (!selectedIndexData) return false;

    for (const subField of selectedIndexData.subFields) {
      if (subField.isRequired && !documentData[subField.name]) {
        toast({
          title: "Validation Error",
          description: `${subField.name} is required`,
          variant: "destructive"
        });
        return false;
      }

      // Additional validation based on field type and validation rules
      for (const validation of subField.validations) {
        const value = documentData[subField.name];
        
        if (validation.type === 'minLength' && value && value.toString().length < parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${subField.name} is too short`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'maxLength' && value && value.toString().length > parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${subField.name} is too long`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'min' && value && parseInt(value.toString()) < parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${subField.name} is below minimum value`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'max' && value && parseInt(value.toString()) > parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${subField.name} exceeds maximum value`,
            variant: "destructive"
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!selectedIndex) {
      toast({
        title: "Error",
        description: "Please select an index",
        variant: "destructive"
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one file",
        variant: "destructive"
      });
      return;
    }

    if (!validateDocument()) {
      return;
    }

    // Process each uploaded file
    uploadedFiles.forEach(file => {
      const newDocument: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random()}`,
        name: file.name,
        file,
        indexId: selectedIndex,
        data: { ...documentData },
        uploadedAt: new Date()
      };

      setDocuments(prev => [...prev, newDocument]);
    });

    // Reset form
    setUploadedFiles([]);
    setDocumentData({});
    setSelectedIndex('');

    toast({
      title: "Success",
      description: `${uploadedFiles.length} document(s) uploaded successfully`
    });
  };

  const selectedIndexData = indexes.find(idx => idx.id === selectedIndex);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage documents with custom index data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Select an index and upload your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Index</Label>
              <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an index" />
                </SelectTrigger>
                <SelectContent>
                  {indexes.map(index => (
                    <SelectItem key={index.id} value={index.id}>
                      {index.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
                  </p>
                </label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Index Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Index Data</CardTitle>
            <CardDescription>
              Fill in the index fields for your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedIndexData ? (
              selectedIndexData.subFields.map(subField => (
                <div key={subField.id}>
                  <Label>
                    {subField.name}
                    {subField.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {subField.fieldType === 'text' && (
                    <Input
                      value={documentData[subField.name]?.toString() || ''}
                      onChange={(e) => handleFieldChange(subField.name, e.target.value)}
                      placeholder={subField.description}
                    />
                  )}
                  {subField.fieldType === 'number' && (
                    <Input
                      type="number"
                      value={documentData[subField.name]?.toString() || ''}
                      onChange={(e) => handleFieldChange(subField.name, e.target.value)}
                      placeholder={subField.description}
                    />
                  )}
                  {subField.fieldType === 'date' && (
                    <Input
                      type="date"
                      value={documentData[subField.name]?.toString() || ''}
                      onChange={(e) => handleFieldChange(subField.name, e.target.value)}
                    />
                  )}
                  {subField.fieldType === 'email' && (
                    <Input
                      type="email"
                      value={documentData[subField.name]?.toString() || ''}
                      onChange={(e) => handleFieldChange(subField.name, e.target.value)}
                      placeholder={subField.description}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select an index to see its fields
              </p>
            )}

            {selectedIndexData && (
              <Button 
                onClick={handleSubmit}
                className="w-full"
                disabled={uploadedFiles.length === 0}
              >
                Upload Documents
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Recently uploaded documents with their index data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{doc.name}</h3>
                    <span className="text-sm text-gray-500">
                      {doc.uploadedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(doc.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value?.toString()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Documents;
