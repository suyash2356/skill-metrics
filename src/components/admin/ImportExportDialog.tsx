import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Resource, ResourceInsert, useBulkCreateResources } from '@/hooks/useAdmin';
import { Download, Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: Resource[];
}

// All resource fields for complete export/import
const ALL_FIELDS = [
  'title', 'description', 'link', 'category', 'difficulty', 'is_free',
  'icon', 'color', 'related_skills', 'relevant_backgrounds', 'provider',
  'duration', 'rating', 'is_featured', 'is_active', 'resource_type',
  'section_type', 'target_countries', 'estimated_time', 'prerequisites',
  'education_levels', 'avg_rating', 'weighted_rating', 'total_ratings',
  'recommend_percent', 'total_votes', 'total_reviews'
];

const ImportExportDialog = ({ open, onOpenChange, resources }: ImportExportDialogProps) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreate = useBulkCreateResources();

  const exportToJSON = () => {
    const exportData = resources.map(({ id, created_at, updated_at, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'resources.json');
    toast.success('Exported to JSON successfully!');
  };

  const exportToCSV = () => {
    const headers = ALL_FIELDS;
    
    const csvRows = [
      headers.join(','),
      ...resources.map(r => headers.map(header => {
        const value = r[header as keyof Resource];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return escapeCSV(value.join(';'));
        if (typeof value === 'boolean') return value.toString();
        if (typeof value === 'number') return value.toString();
        return escapeCSV(String(value));
      }).join(','))
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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
      setImportFormat(file.name.endsWith('.csv') ? 'csv' : 'json');
      setValidationErrors([]);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv: string): Partial<ResourceInsert>[] => {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const results: Partial<ResourceInsert>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: Record<string, unknown> = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        switch (header) {
          case 'is_free':
          case 'is_featured':
          case 'is_active':
            obj[header] = value.toLowerCase() === 'true';
            break;
          case 'rating':
          case 'avg_rating':
          case 'weighted_rating':
            obj[header] = value ? parseFloat(value) : null;
            break;
          case 'total_ratings':
          case 'recommend_percent':
          case 'total_votes':
          case 'total_reviews':
            obj[header] = value ? parseInt(value, 10) : null;
            break;
          case 'related_skills':
          case 'relevant_backgrounds':
          case 'target_countries':
          case 'prerequisites':
          case 'education_levels':
            obj[header] = value ? value.split(';').map(s => s.trim()).filter(Boolean) : [];
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

  // Pre-import validation
  const validateResources = (data: Partial<ResourceInsert>[]): { valid: ResourceInsert[]; errors: string[] } => {
    const valid: ResourceInsert[] = [];
    const errors: string[] = [];

    data.forEach((item, index) => {
      const rowNum = index + 1;
      const rowErrors: string[] = [];

      // Required field validation
      if (!item.title?.trim()) {
        rowErrors.push('title is required');
      }
      if (!item.link?.trim()) {
        rowErrors.push('link is required');
      }
      if (!item.category?.trim()) {
        rowErrors.push('category is required');
      }

      // URL validation
      if (item.link && !isValidUrl(item.link)) {
        rowErrors.push('invalid link URL');
      }

      if (rowErrors.length > 0) {
        errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
      } else {
        // Build valid resource with defaults
        valid.push({
          title: item.title!.trim(),
          description: item.description?.trim() || '',
          link: item.link!.trim(),
          category: item.category!.trim(),
          difficulty: item.difficulty || 'beginner',
          is_free: item.is_free ?? true,
          icon: item.icon || '📚',
          color: item.color || 'blue',
          related_skills: item.related_skills || [],
          relevant_backgrounds: item.relevant_backgrounds || [],
          provider: item.provider || null,
          duration: item.duration || null,
          rating: item.rating || null,
          is_featured: item.is_featured ?? false,
          is_active: item.is_active ?? true,
          resource_type: item.resource_type || 'course',
          section_type: item.section_type || 'domain',
          target_countries: item.target_countries || [],
          estimated_time: item.estimated_time || null,
          prerequisites: item.prerequisites || [],
          education_levels: item.education_levels || [],
        });
      }
    });

    return { valid, errors };
  };

  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Please provide data to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);
    setValidationErrors([]);

    let dataToImport: Partial<ResourceInsert>[] = [];

    // Parse the data
    try {
      if (importFormat === 'json') {
        const parsed = JSON.parse(importData);
        dataToImport = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        dataToImport = parseCSV(importData);
      }
    } catch (error) {
      toast.error('Failed to parse data. Check format.');
      setIsImporting(false);
      return;
    }

    if (dataToImport.length === 0) {
      toast.error('No data to import');
      setIsImporting(false);
      return;
    }

    setImportProgress(10);

    // Validate all resources before importing
    const { valid, errors: validationErrs } = validateResources(dataToImport);
    
    if (validationErrs.length > 0) {
      setValidationErrors(validationErrs.slice(0, 10)); // Show first 10 errors
      if (validationErrs.length > 10) {
        setValidationErrors(prev => [...prev, `... and ${validationErrs.length - 10} more errors`]);
      }
    }

    if (valid.length === 0) {
      toast.error('No valid resources to import');
      setIsImporting(false);
      return;
    }

    setImportProgress(30);

    // Bulk insert using the new mutation
    try {
      const result = await bulkCreate.mutateAsync(valid);
      
      setImportProgress(100);
      
      const successCount = result.inserted.length;
      const failedCount = valid.length - successCount + validationErrs.length;
      
      setImportResult({ 
        success: successCount, 
        failed: failedCount,
        errors: result.errors 
      });

      if (successCount > 0) {
        toast.success(`Imported ${successCount} resources successfully!`);
      }
      if (failedCount > 0) {
        toast.error(`Failed to import ${failedCount} resources`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed. Please try again.');
      setImportResult({ 
        success: 0, 
        failed: dataToImport.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }

    setIsImporting(false);
  };

  const copyTemplate = (format: 'json' | 'csv') => {
    const template = format === 'json' 
      ? JSON.stringify([{
          title: "Example Resource",
          description: "Description here",
          link: "https://example.com",
          category: "Web Development",
          difficulty: "beginner",
          is_free: true,
          icon: "📚",
          color: "blue",
          related_skills: ["react", "javascript"],
          relevant_backgrounds: ["tech"],
          provider: "Provider Name",
          duration: "10 hours",
          is_featured: false,
          is_active: true,
          resource_type: "course",
          section_type: "domain",
          target_countries: ["India", "USA"],
          prerequisites: ["HTML", "CSS"],
          education_levels: ["undergraduate", "graduate"]
        }], null, 2)
      : `title,description,link,category,difficulty,is_free,icon,color,related_skills,relevant_backgrounds,provider,duration,is_featured,is_active,resource_type,section_type,target_countries,prerequisites,education_levels
Example Resource,Description here,https://example.com,Web Development,beginner,true,📚,blue,react;javascript,tech,Provider Name,10 hours,false,true,course,domain,India;USA,HTML;CSS,undergraduate;graduate`;
    
    navigator.clipboard.writeText(template);
    toast.success(`${format.toUpperCase()} template copied!`);
  };

  const resetImport = () => {
    setImportData('');
    setImportResult(null);
    setValidationErrors([]);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="flex gap-2 flex-wrap">
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
              {(importData || importResult) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetImport}
                >
                  Reset
                </Button>
              )}
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
                disabled={isImporting}
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
                ? 'Paste JSON array here...\n[\n  { "title": "...", "description": "...", "link": "...", "category": "...", ... }\n]'
                : 'Paste CSV data here...\ntitle,description,link,category,difficulty,...'
              }
              value={importData}
              onChange={(e) => {
                setImportData(e.target.value);
                setValidationErrors([]);
                setImportResult(null);
              }}
              className="min-h-[200px] font-mono text-sm"
              disabled={isImporting}
            />

            {isImporting && (
              <div className="space-y-2">
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Importing... {importProgress}%
                </p>
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Validation errors found:</p>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importResult && (
              <Alert variant={importResult.failed > 0 ? "destructive" : "default"}>
                {importResult.failed > 0 ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <p>
                    Imported {importResult.success} resources successfully.
                    {importResult.failed > 0 && ` Failed: ${importResult.failed}`}
                  </p>
                  {importResult.errors.length > 0 && (
                    <ul className="list-disc pl-4 text-sm mt-2">
                      {importResult.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
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

            <p className="text-xs text-muted-foreground">
              Required fields: title, link, category. Max file size: 5MB. 
              Array fields (skills, countries, etc.) use semicolon separator in CSV.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;