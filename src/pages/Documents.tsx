
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { useDocumentTypes } from '@/hooks/useDocumentTypes';
import { toast } from '@/hooks/use-toast';

interface DocumentData {
  [key: string]: string | number;
}

interface UploadedDocument {
  id: string;
  name: string;
  file: File;
  documentTypeId: string;
  data: DocumentData;
  uploadedAt: Date;
}

const Documents = () => {
  const { documentTypes, getAllFieldsForDocumentType } = useDocumentTypes();
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
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
    const allFields = getAllFieldsForDocumentType(selectedDocumentType);
    
    for (const field of allFields) {
      if (field.isRequired && !documentData[field.name]) {
        toast({
          title: "Validation Error",
          description: `${field.name} (from ${field.indexName}) is required`,
          variant: "destructive"
        });
        return false;
      }

      // Additional validation based on field type and validation rules
      for (const validation of field.validations) {
        const value = documentData[field.name];
        
        if (validation.type === 'minLength' && value && value.toString().length < parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${field.name} is too short`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'maxLength' && value && value.toString().length > parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${field.name} is too long`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'min' && value && parseInt(value.toString()) < parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${field.name} is below minimum value`,
            variant: "destructive"
          });
          return false;
        }

        if (validation.type === 'max' && value && parseInt(value.toString()) > parseInt(validation.value || '0')) {
          toast({
            title: "Validation Error",
            description: validation.message || `${field.name} exceeds maximum value`,
            variant: "destructive"
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!selectedDocumentType) {
      toast({
        title: "Error",
        description: "Please select a document type",
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
        documentTypeId: selectedDocumentType,
        data: { ...documentData },
        uploadedAt: new Date()
      };

      setDocuments(prev => [...prev, newDocument]);
    });

    // Reset form
    setUploadedFiles([]);
    setDocumentData({});
    setSelectedDocumentType('');

    toast({
      title: "Success",
      description: `${uploadedFiles.length} document(s) uploaded successfully`
    });
  };

  const allFields = selectedDocumentType ? getAllFieldsForDocumentType(selectedDocumentType) : [];
  const selectedDocumentTypeData = documentTypes.find(dt => dt.id === selectedDocumentType);

  // Group fields by index name for better organization
  const fieldsByIndex = allFields.reduce((acc, field) => {
    const indexName = field.indexName;
    if (!acc[indexName]) {
      acc[indexName] = [];
    }
    acc[indexName].push(field);
    return acc;
  }, {} as Record<string, typeof allFields>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage documents by selecting a document type
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Select a document type and upload your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(docType => (
                    <SelectItem key={docType.id} value={docType.id}>
                      {docType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDocumentTypeData && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDocumentTypeData.description}
                </p>
              )}
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

        {/* Document Type Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Fields</CardTitle>
            <CardDescription>
              Fill in the required fields for your document type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedDocumentType ? (
              Object.entries(fieldsByIndex).map(([indexName, fields]) => (
                <div key={indexName} className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      {indexName}
                    </h3>
                  </div>
                  {fields.map(field => (
                    <div key={`${field.indexId}_${field.id}`}>
                      <Label>
                        {field.name}
                        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.fieldType === 'text' && (
                        <Input
                          value={documentData[field.name]?.toString() || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={field.description}
                        />
                      )}
                      {field.fieldType === 'number' && (
                        <Input
                          type="number"
                          value={documentData[field.name]?.toString() || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={field.description}
                        />
                      )}
                      {field.fieldType === 'date' && (
                        <Input
                          type="date"
                          value={documentData[field.name]?.toString() || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />
                      )}
                      {field.fieldType === 'email' && (
                        <Input
                          type="email"
                          value={documentData[field.name]?.toString() || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={field.description}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a document type to see its fields
              </p>
            )}

            {selectedDocumentType && (
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
              Recently uploaded documents with their field data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map(doc => {
                const docType = documentTypes.find(dt => dt.id === doc.documentTypeId);
                return (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {docType?.name}
                        </p>
                      </div>
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Documents;
