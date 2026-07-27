'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from './loading-spinner';

export default function PdfUploader() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === 'application/pdf'
    );

    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error('Only PDF files are accepted');
    }

    setFiles(pdfFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('pdf', files[0]);

    try {
      const response = await fetch('/api/sets', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study materials');
      }

      toast.success('Study materials ready');
      setFiles([]);
      router.push(`/sets/${data.id}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/40'
          } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input {...getInputProps()} />
          <FileUp className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          {files.length > 0 ? (
            <p className="font-medium">{files[0].name}</p>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">Drag & drop your PDF here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse (max 10MB)
              </p>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Generating…
              </span>
            ) : (
              'Generate study materials'
            )}
          </Button>
        )}

        {isLoading && (
          <Alert>
            <AlertDescription>
              Extracting text and generating flashcards and quiz questions.
              This can take a little while.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
