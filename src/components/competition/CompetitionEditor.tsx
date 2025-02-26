/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Calendar } from '@/components/ui/calendar';
import { Eye, EyeOff, Pencil, Upload, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Stage {
  title: string;
  guidelineFileURL: string;
  description: string;
  deadline: Date;
  isVisible?: boolean;
}

interface Competition {
  id: string;
  name: string;
  description: string;
  registrationDeadline: Date;
  stages: Record<string, Stage>;
}

interface FormData {
  name: string;
  description: string;
  registrationDeadline: Date;
  stages: Record<string, Stage>;
}

interface CompetitionEditorProps {
  competition: Competition;
  onUpdateCompetition: (id: string, updates: Partial<Competition>) => Promise<void>;
  onUpdateStageVisibility: (stageId: string, isVisible: boolean) => Promise<void>;
  onUpdateStageGuideline: (stageId: string, file: File, description: string) => Promise<void>;
}

interface EditMode {
  [key: string]: boolean;
}

interface LoadingState {
  [key: string]: boolean;
}

const CompetitionEditor: React.FC<CompetitionEditorProps> = ({ 
  competition, 
  onUpdateCompetition,
  onUpdateStageVisibility,
  onUpdateStageGuideline
}) => {
  const [editMode, setEditMode] = useState<EditMode>({});
  const [formData, setFormData] = useState<FormData>({
    name: competition.name,
    description: competition.description,
    registrationDeadline: competition.registrationDeadline,
    stages: { ...competition.stages }
  });
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [tempDate, setTempDate] = useState<Date | null>(null);

  useEffect(() => {
    setFormData({
      name: competition.name,
      description: competition.description,
      registrationDeadline: competition.registrationDeadline,
      stages: { ...competition.stages }
    });
  }, [competition]);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  }, []);

  const handleUpdate = async (field: keyof FormData, value: any, path?: string) => {
    const loadingKey = path || field;
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setError('');

      const updates = path 
        ? { [path]: value }
        : { [field]: value };

      await onUpdateCompetition(competition.id, updates);
      
      setFormData(prev => ({
        ...prev,
        ...(path ? { [path]: value } : { [field]: value })
      }));
      
      setEditMode(prev => ({ ...prev, [loadingKey]: false }));
      showSuccess(`${field} updated successfully`);
    } catch (error) {
      setError(`Failed to update ${field}`);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleStageUpdate = async (stageNumber: string, updates: Partial<Stage>) => {
    const loadingKey = `stage-${stageNumber}`;
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setError('');
      
      const updatedStages = {
        ...formData.stages,
        [stageNumber]: {
          ...formData.stages[stageNumber],
          ...updates
        }
      };

      await onUpdateCompetition(competition.id, { stages: updatedStages });
      
      setFormData(prev => ({
        ...prev,
        stages: updatedStages
      }));
      
      setEditMode(prev => ({ ...prev, [loadingKey]: false }));
      showSuccess('Stage updated successfully');
    } catch (error) {
      setError('Failed to update stage');
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleStageVisibilityToggle = async (stageNumber: string) => {
    const loadingKey = `visibility-${stageNumber}`;
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setError('');

      const currentStage = formData.stages[stageNumber];
      const newVisibility = !currentStage.isVisible;

      await onUpdateStageVisibility(stageNumber, newVisibility);

      setFormData(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          [stageNumber]: {
            ...prev.stages[stageNumber],
            isVisible: newVisibility
          }
        }
      }));

      showSuccess(`Stage visibility updated successfully`);
    } catch (error) {
      setError('Failed to update stage visibility');
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleFileUpload = async (stageNumber: string, file: File) => {
    const loadingKey = `file-${stageNumber}`;
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setError('');

      const currentStage = formData.stages[stageNumber];
      console.log('Uploading file:', {
        stageNumber,
        fileName: file.name,
        description: currentStage.description
      });

      await onUpdateStageGuideline(stageNumber, file, currentStage.description);
      showSuccess('Guidelines uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload guidelines');
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const renderEditableField = (
    field: string,
    value: string,
    label: string,
    type: 'input' | 'textarea' = 'input',
    path?: string
  ) => {
    const isEditing = editMode[field];
    const isLoading = loading[field];
    const InputComponent = type === 'input' ? Input : Textarea;
    
    const [tempValue, setTempValue] = useState<string>(value || '');
    
    const currentValue = path
      ? formData.stages[path.split('-')[1]]?.description || ''
      : (formData[field as keyof FormData] as string) || '';
  
    useEffect(() => {
      setTempValue(currentValue);
    }, [currentValue]);
    
    const handleSave = async () => {
      if (path) {
        const [_, stageNumber] = path.split('-');
        await handleStageUpdate(stageNumber, { description: tempValue });
      } else {
        await handleUpdate(field as keyof FormData, tempValue);
      }
      setEditMode(prev => ({ ...prev, [field]: false }));
    };
  
    const handleCancel = () => {
      setTempValue(currentValue);
      setEditMode(prev => ({ ...prev, [field]: false }));
    };
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{label}</h3>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditMode(prev => ({ ...prev, [field]: true }))}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <InputComponent
              value={tempValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setTempValue(e.target.value);
              }}
              className={type === 'textarea' ? "min-h-[100px]" : ""}
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{value || currentValue}</p>
        )}
      </div>
    );
  };

  const FileUploadDialog = ({ stageNumber, stage }: { stageNumber: string; stage: Stage }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isLoading = loading[`file-${stageNumber}`];
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        setSelectedFile(file);
      }
    };
  
    const handleUpload = async () => {
      if (selectedFile) {
        try {
          await handleFileUpload(stageNumber, selectedFile);
          setIsDialogOpen(false);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error in handleUpload:', error);
        }
      }
    };
  
    const handleCancel = () => {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsDialogOpen(false);
    };
  
    return (
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {stage.guidelineFileURL ? 'Update Guidelines' : 'Upload Guidelines'}
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {stage.guidelineFileURL ? 'Update Guidelines' : 'Upload Guidelines'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {stage.guidelineFileURL ?
                'Select a new PDF file to update the guidelines for this stage.' :
                'Select a PDF file to upload as guidelines for this stage.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleSelectFile}
            />
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Confirm Upload'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competition Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderEditableField('name', formData.name, 'Competition Name')}
          {renderEditableField('description', formData.description, 'Description', 'textarea')}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Registration Deadline</h3>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span>{formData.registrationDeadline?.toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Registration Deadline</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={tempDate || formData.registrationDeadline}
                    onSelect={(day) => setTempDate(day || null)}
                    disabled={loading['registrationDeadline']}
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setTempDate(null)}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button 
                        onClick={async () => {
                          if (tempDate) {
                            await handleUpdate('registrationDeadline', tempDate);
                            setTempDate(null);
                          }
                        }}
                        disabled={loading['registrationDeadline'] || !tempDate}
                        >
                          {loading['registrationDeadline'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Confirm
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(formData.stages).map(([stageNumber, stage]) => (
                <Card key={stageNumber} className="border rounded-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Stage {stageNumber}: {stage.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStageVisibilityToggle(stageNumber)}
                        disabled={loading[`visibility-${stageNumber}`]}
                      >
                        {loading[`visibility-${stageNumber}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : stage.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Deadline</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <span>{stage.deadline?.toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Stage Deadline</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Calendar
                              mode="single"
                              selected={tempDate || stage.deadline}
                              onSelect={(day) => setTempDate(day || null)}
                              disabled={loading[`stage-${stageNumber}`]}
                            />
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline" onClick={() => setTempDate(null)}>
                                  Cancel
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button 
                                  onClick={async () => {
                                    if (tempDate) {
                                      await handleStageUpdate(stageNumber, { deadline: tempDate });
                                      setTempDate(null);
                                    }
                                  }}
                                  disabled={loading[`stage-${stageNumber}`] || !tempDate}
                                >
                                  {loading[`stage-${stageNumber}`] && 
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Confirm
                                </Button>
                              </DialogClose>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
  
                    {renderEditableField(
                      `stage-${stageNumber}-description`,
                      stage.description,
                      'Description',
                      'textarea',
                      `stage-${stageNumber}`
                    )}
  
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Guidelines</h4>
                      <div className="flex items-center gap-4">
                        <p className="text-sm">
                          {stage.guidelineFileURL ? (
                            <a 
                              href={stage.guidelineFileURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {decodeURIComponent(stage.guidelineFileURL).split('/').slice(-1)[0].split('?')[0]}
                            </a>
                          ) : (
                            <span className="text-gray-500">No guidelines uploaded</span>
                          )}
                        </p>
                        <FileUploadDialog stageNumber={stageNumber} stage={stage} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
  
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
  
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  export default CompetitionEditor;