import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Resource, ResourceInsert, useCreateResource } from '@/hooks/useAdmin';
import { Download, Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: Resource[];
}

const ImportExportDialog = ({ open, onOpenChange, resources }: ImportExportDialogProps) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createResource = useCreateResource();

  const exportToJSON = () => {
    const exportData = resources.map(({ id, created_at, updated_at, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'resources.json');
    toast.success('Exported to JSON successfully!');
  };

  const exportToCSV = () => {
    const headers = [
      'title', 'description', 'link', 'category', 'difficulty', 'is_free',
      'icon', 'color', 'related_skills', 'relevant_backgrounds', 'provider',
      'duration', 'rating', 'is_featured', 'is_active'
    ];
    
    const csvRows = [
      headers.join(','),
      ...resources.map(r => [
        escapeCSV(r.title),
        escapeCSV(r.description),
        escapeCSV(r.link),
        escapeCSV(r.category),
        escapeCSV(r.difficulty),
        r.is_free,
        escapeCSV(r.icon),
        escapeCSV(r.color),
        escapeCSV(r.related_skills.join(';')),
        escapeCSV(r.relevant_backgrounds.join(';')),
        escapeCSV(r.provider || ''),
        escapeCSV(r.duration || ''),
        r.rating || '',
        r.is_featured,
        r.is_active
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    downloadBlob(blob, 'resources.csv');
    toast.success('Exported to CSV successfully!');
  };

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
      setImportFormat(file.name.endsWith('.csv') ? 'csv' : 'json');
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv: string): Partial<ResourceInsert>[] => {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const results: Partial<ResourceInsert>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: Record<string, unknown> = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'is_free':
          case 'is_featured':
          case 'is_active':
            obj[header] = value.toLowerCase() === 'true';
            break;
          case 'rating':
            obj[header] = value ? parseFloat(value) : null;
            break;
          case 'related_skills':
          case 'relevant_backgrounds':
            obj[header] = value ? value.split(';').map(s => s.trim()) : [];
            break;
          default:
            obj[header] = value || null;
        }
      });
      
      results.push(obj as Partial<ResourceInsert>);
    }
    
    return results;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Please provide data to import');
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    let dataToImport: Partial<ResourceInsert>[] = [];

    try {
      if (importFormat === 'json') {
        dataToImport = JSON.parse(importData);
        if (!Array.isArray(dataToImport)) {
          dataToImport = [dataToImport];
        }
      } else {
        dataToImport = parseCSV(importData);
      }
    } catch (error) {
      toast.error('Failed to parse data. Check format.');
      setIsImporting(false);
      return;
    }

    let success = 0;
    let failed = 0;

    for (const item of dataToImport) {
      try {
        const resource: ResourceInsert = {
          title: item.title || 'Untitled',
          description: item.description || '',
          link: item.link || '',
          category: item.category || 'General',
          difficulty: item.difficulty || 'Beginner',
          is_free: item.is_free ?? true,
          icon: item.icon || '📚',
          color: item.color || 'bg-blue-500',
          related_skills: item.related_skills || [],
          relevant_backgrounds: item.relevant_backgrounds || [],
          provider: item.provider || null,
          duration: item.duration || null,
          rating: item.rating || null,
          is_featured: item.is_featured ?? false,
          is_active: item.is_active ?? true,
        };

        await new Promise<void>((resolve, reject) => {
          createResource.mutate(resource, {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          });
        });
        success++;
      } catch (error) {
        console.error('Failed to import resource:', error);
        failed++;
      }
    }

    setImportResult({ success, failed });
    setIsImporting(false);
    
    if (success > 0) {
      toast.success(`Imported ${success} resources successfully!`);
    }
    if (failed > 0) {
      toast.error(`Failed to import ${failed} resources`);
    }
  };

  const copyTemplate = (format: 'json' | 'csv') => {
    const template = format === 'json' 
      ? JSON.stringify([{
          title: "Example Resource",
          description: "Description here",
          link: "https://example.com",
          category: "Web Development",
          difficulty: "Beginner",
          is_free: true,
          icon: "📚",
          color: "bg-blue-500",
          related_skills: ["react", "javascript"],
          relevant_backgrounds: ["tech"],
          provider: "Provider Name",
          duration: "10 hours",
          rating: 4.5,
          is_featured: false,
          is_active: true
        }], null, 2)
      : 'title,description,link,category,difficulty,is_free,icon,color,related_skills,relevant_backgrounds,provider,duration,rating,is_featured,is_active\nExample Resource,Description here,https://example.com,Web Development,Beginner,true,📚,bg-blue-500,react;javascript,tech,Provider Name,10 hours,4.5,false,true';
    
    navigator.clipboard.writeText(template);
    toast.success(`${format.toUpperCase()} template copied!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import / Export Resources</DialogTitle>
          <DialogDescription>
            Bulk manage resources using JSON or CSV files
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'export' | 'import')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <Download className="mr-2 h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Export all {resources.length} resources to a file for backup or editing.
            </p>
            <div className="flex gap-4">
              <Button onClick={exportToJSON} className="flex-1">
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="flex-1">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyTemplate('json')}
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy JSON Template
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyTemplate('csv')}
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy CSV Template
              </Button>
            </div>

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <Tabs value={importFormat} onValueChange={(v) => setImportFormat(v as 'json' | 'csv')}>
                <TabsList>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="csv">CSV</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Textarea
              placeholder={importFormat === 'json' 
                ? 'Paste JSON array here...\n[\n  { "title": "...", "description": "...", ... }\n]'
                : 'Paste CSV data here...\ntitle,description,link,category,...'
              }
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />

            {importResult && (
              <Alert variant={importResult.failed > 0 ? "destructive" : "default"}>
                {importResult.failed > 0 ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  Imported {importResult.success} resources successfully.
                  {importResult.failed > 0 && ` Failed: ${importResult.failed}`}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleImport} 
              disabled={isImporting || !importData.trim()}
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Resources
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;
