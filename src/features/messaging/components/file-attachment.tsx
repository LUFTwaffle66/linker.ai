import { Button } from '@/components/ui/button';
import { File, Download, X } from 'lucide-react';
import type { FileAttachment as FileAttachmentType } from '../types';

interface FileAttachmentProps {
  file: FileAttachmentType;
  canRemove?: boolean;
  onRemove?: () => void;
}

export function FileAttachment({ file, canRemove = false, onRemove }: FileAttachmentProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded">
        <File className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>

      {canRemove ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
          <X className="w-4 h-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={file.url} download={file.name}>
            <Download className="w-4 h-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
