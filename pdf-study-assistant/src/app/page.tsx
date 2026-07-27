import PdfUploader from '@/components/pdf-uploader';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Turn a PDF into study materials
        </h1>
        <p className="text-muted-foreground">
          Upload a study document and AI will generate flashcards and practice
          questions. Everything is saved to the shared library so you can come
          back anytime.
        </p>
      </div>
      <PdfUploader />
    </div>
  );
}
