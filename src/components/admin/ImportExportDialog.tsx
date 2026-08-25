import { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Resource, ResourceInsert, useBulkCreateResources } from '@/hooks/useAdmin';
import { resolveCategoryMapping } from '@/utils/categoryMapping';
import { useCategories } from '@/hooks/useCategories';
import { Download, Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

const RESOURCE_TYPES = [
  { value: 'course', label: '📚 Course' },
  { value: 'video', label: '🎬 Video' },
  { value: 'book', label: '📖 Book' },
  { value: 'blog', label: '📝 Blog/Article' },
  { value: 'research_paper', label: '🔬 Research Paper' },
  { value: 'website', label: '🌐 Website' },
  { value: 'certification', label: '🏆 Certification' },
  { value: 'degree', label: '🎓 Degree Program' },
  { value: 'learning_path', label: '🗺️ Learning Path' },
  { value: 'coaching', label: '👨‍🏫 Coaching/Tutorial' },
  { value: 'exam_prep', label: '📋 Exam Prep' },
];

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: Resource[];
}

const ImportExportDialog = ({ open, onOpenChange, resources }: ImportExportDialogProps) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [defaultResourceType, setDefaultResourceType] = useState<string>('course');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[]; skipped?: number } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreate = useBulkCreateResources();
  const { data: categories = [] } = useCategories();

  /** Case-insensitive lookup of admin-managed category names -> type */
  const categoryTypes = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.name.trim().toLowerCase(), c.type));
    return map;
  }, [categories]);

  const exportToJSON = () => {

    const blob = new Blob([toJSONExport(resources)], { type: 'application/json' });
    downloadBlob(blob, 'resources.json');
    toast.success('Exported to JSON successfully!');
  };

  const exportToCSV = () => {
    const blob = new Blob([toCSVExport(resources)], { type: 'text/csv' });
    downloadBlob(blob, 'resources.csv');
    toast.success('Exported to CSV successfully!');
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

  const validateRows = (data: Record<string, any>[], fallbackResourceType: string) =>
    validateResources(data, fallbackResourceType, categoryTypes);


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
    const { valid, errors: validationErrs } = validateResources(dataToImport, defaultResourceType);
    
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

    // Bulk insert using upsert (skips duplicates automatically)
    try {
      const result = await bulkCreate.mutateAsync(valid);
      
      setImportProgress(100);
      
      const successCount = result.inserted.length;
      const skippedCount = result.skipped || 0;
      const failedCount = validationErrs.length + result.errors.length;
      
      setImportResult({ 
        success: successCount, 
        failed: failedCount,
        errors: result.errors,
        skipped: skippedCount
      });

      if (successCount > 0) {
        toast.success(`Imported ${successCount} new resources!`);
      }
      if (skippedCount > 0) {
        toast.info(`Skipped ${skippedCount} duplicate resources`);
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
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        skipped: 0
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
          category: "Domains",           // "Domains" or "Exams"
          subcategory: "Web Development", // e.g. "Web Development", "IMUCET", "GRE"
          skills: ["react", "javascript"],
          difficulty: "beginner",
          is_free: true,
          icon: "📚",
          color: "blue",
          relevant_backgrounds: ["tech"],
          provider: "Provider Name",
          duration: "10 hours",
          is_featured: false,
          is_active: true,
          resource_type: "course",
          target_countries: ["India", "USA"],
          prerequisites: ["HTML", "CSS"],
          education_levels: ["undergraduate", "graduate"]
        }], null, 2)
      : `title,description,link,category,subcategory,skills,difficulty,is_free,icon,color,relevant_backgrounds,provider,duration,is_featured,is_active,resource_type,target_countries,prerequisites,education_levels
Example Resource,Description here,https://example.com,Domains,Web Development,react;javascript,beginner,true,📚,blue,tech,Provider Name,10 hours,false,true,course,India;USA,HTML;CSS,undergraduate;graduate`;

    navigator.clipboard.writeText(template);
    toast.success(`${format.toUpperCase()} template copied!`);
  };

  const resetImport = () => {
    setImportData('');
    setImportResult(null);
    setValidationErrors([]);
    setImportProgress(0);
    setDefaultResourceType('course');
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

            {/* Default resource type for this batch */}
            <div className="space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <Label className="text-sm font-medium">Default Resource Type for this batch</Label>
              <p className="text-xs text-muted-foreground">
                Applied to rows that don't have a <code className="bg-muted px-1 rounded">resource_type</code> field.
                Choose the correct type so resources appear in the right explore tab.
              </p>
              <Select value={defaultResourceType} onValueChange={setDefaultResourceType}>
                <SelectTrigger className="w-[240px] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    ✅ Imported {importResult.success} new resources.
                    {importResult.skipped && importResult.skipped > 0 && ` ⏭️ Skipped ${importResult.skipped} duplicates.`}
                    {importResult.failed > 0 && ` ❌ Failed: ${importResult.failed}`}
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

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Required:</strong> <code>title</code>, <code>link</code>, <code>category</code>, <code>subcategory</code>.</p>
              <p><strong>category</strong>: <code>"Domains"</code> or <code>"Exams"</code> — decides which section the resource lives in.</p>
              <p><strong>subcategory</strong>: the specific tab title (e.g. <code>"Web Development"</code>, <code>"IMUCET"</code>, <code>"GRE"</code>). Must match a known mapping unless <code>category="Exams"</code>.</p>
              <p><strong>skills</strong>: list of skills the learner picks up (CSV: semicolon-separated).</p>
              <p>Legacy rows (old <code>category</code> + <code>section_type</code>) still import. Duplicates are skipped. Max 5MB.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;