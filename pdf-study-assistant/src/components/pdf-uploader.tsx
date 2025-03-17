import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStore } from '@/lib/store';
import LoadingSpinner from './loading-spinner';

export default function PdfUploader() {
  const [files, setFiles] = useState([]);
  const { isLoading, setLoading, setError, addMaterial } = useStudyStore();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      file => file.type === 'application/pdf'
    );
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are accepted",
        variant: "destructive"
      });
    }
    
    setFiles(pdfFiles);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('pdf', files[0]);
    
    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF');
      }
      
      const { fileId, fileName } = await uploadResponse.json();
      
      // Generate study materials
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, fileName }),
      });
      
      if (!generateResponse.ok) {
        throw new Error('Failed to generate study materials');
      }
      
      const studyMaterials = await generateResponse.json();
      addMaterial(studyMaterials);
      
      toast({
        title: "Success!",
        description: "Your study materials are ready.",
      });
      
      // Clear uploaded files
      setFiles([]);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <p>{files[0].name}</p>
          ) : (
            <p>Drag & drop your PDF here, or click to browse</p>
          )}
        </div>
        {files.length > 0 && (
          <Button onClick={handleUpload} disabled={isLoading} className="mt-4 w-full">
            {isLoading ? <LoadingSpinner /> : 'Generate Study Materials'}
          </Button>
        )}
        {isLoading && (
          <Alert>
            <AlertDescription>Analyzing your PDF and generating study materials...</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
