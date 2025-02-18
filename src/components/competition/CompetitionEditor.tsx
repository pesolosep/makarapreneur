import React, { useState } from 'react';
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
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar } from '@/components/ui/calendar';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import { Competition, Stage } from '@/models/Competition';

interface CompetitionEditorProps {
  competition: Competition;
  onUpdateCompetition: (competitionId: string, updates: Partial<Competition>) => Promise<void>;
  onUpdateStageVisibility: (competitionId: string, stageNumber: number, visibility: boolean) => Promise<void>;
  onUpdateStageGuideline: (competitionId: string, stageNumber: number, file: File, description: string) => Promise<void>;
}

interface EditModeState {
  name: boolean;
  description: boolean;
  deadline: boolean;
  stages: Record<string, {
    description: boolean;
    deadline: boolean;
  }>;
}

interface FormDataState {
  name: string;
  description: string;
  registrationDeadline: Date;
  stages: Record<string, Stage>;
}

const CompetitionEditor: React.FC<CompetitionEditorProps> = ({ 
  competition, 
  onUpdateCompetition,
  onUpdateStageVisibility,
  onUpdateStageGuideline
}) => {
  const [editMode, setEditMode] = useState<EditModeState>({
    name: false,
    description: false,
    deadline: false,
    stages: {}
  });
  
  const [formData, setFormData] = useState<FormDataState>({
    name: competition.name,
    description: competition.description,
    registrationDeadline: competition.registrationDeadline,
    stages: competition.stages
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (field: keyof Competition, value: any) => {
    try {
      await onUpdateCompetition(competition.id, { [field]: value });
      setEditMode({ ...editMode, [field]: false });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const handleStageUpdate = async (stageNumber: string, updates: Partial<Stage>) => {
    try {
      const updatedStages = {
        ...competition.stages,
        [stageNumber]: {
          ...competition.stages[parseInt(stageNumber)],
          ...updates
        }
      };

      await onUpdateCompetition(competition.id, {
        stages: updatedStages
      });

      setEditMode(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          [stageNumber]: {
            description: false,
            deadline: false
          }
        }
      }));
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const toggleStageEditMode = (stageNumber: string, field: 'description' | 'deadline', value: boolean) => {
    setEditMode(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageNumber]: {
          ...prev.stages[stageNumber],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Competition Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Editor */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">Competition Name</h3>
              {editMode.name ? (
                <div className="flex gap-2">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="max-w-md"
                  />
                  <Button onClick={() => handleUpdate('name', formData.name)}>Save</Button>
                  <Button variant="outline" onClick={() => setEditMode({ ...editMode, name: false })}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{competition.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode({ ...editMode, name: true })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Description Editor */}
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            {editMode.description ? (
              <div className="space-y-2">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate('description', formData.description)}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode({ ...editMode, description: false })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="whitespace-pre-wrap">{competition.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode({ ...editMode, description: true })}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Registration Deadline Editor */}
          <div>
            <h3 className="text-sm font-medium mb-1">Registration Deadline</h3>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span>{formData.registrationDeadline.toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Registration Deadline</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={formData.registrationDeadline}
                  onSelect={(date) => {
                    if (date) {
                      handleUpdate('registrationDeadline', date);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(competition.stages).map(([stageNumber, stage]) => (
              <Card key={stageNumber} className="border rounded-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Stage {stageNumber}: {stage.title}</CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          {stage.visibility ? (
                            <Eye className="h-4 w-4 mr-2" />
                          ) : (
                            <EyeOff className="h-4 w-4 mr-2" />
                          )}
                          {stage.visibility ? 'Visible' : 'Hidden'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {stage.visibility ? 'Hide Stage' : 'Show Stage'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to {stage.visibility ? 'hide' : 'show'} this stage?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onUpdateStageVisibility(competition.id, parseInt(stageNumber), !stage.visibility)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stage Deadline Editor */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Deadline</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <span>{stage.deadline.toLocaleDateString()}</span>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Stage Deadline</DialogTitle>
                        </DialogHeader>
                        <Calendar
                          mode="single"
                          selected={stage.deadline}
                          onSelect={(date) => {
                            if (date) {
                              handleStageUpdate(stageNumber, { deadline: date });
                            }
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Stage Description Editor */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    {editMode.stages[stageNumber]?.description ? (
                      <div className="space-y-2">
                        <Textarea
                          value={formData.stages[stageNumber].description}
                          onChange={(e) => {
                            const updatedStages = {
                              ...formData.stages,
                              [stageNumber]: {
                                ...formData.stages[stageNumber],
                                description: e.target.value
                              }
                            };
                            setFormData(prev => ({
                              ...prev,
                              stages: updatedStages
                            }));
                          }}
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleStageUpdate(stageNumber, { 
                            description: formData.stages[stageNumber].description 
                          })}>
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => toggleStageEditMode(stageNumber, 'description', false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <p className="whitespace-pre-wrap">{stage.description}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStageEditMode(stageNumber, 'description', true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Stage Guidelines File Upload */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Guidelines File</h4>
                    <div className="flex items-center gap-4">
                      {stage.guidelineFileURL && (
                        <a 
                          href={stage.guidelineFileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Current Guidelines
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              onUpdateStageGuideline(
                                competition.id,
                                parseInt(stageNumber),
                                e.target.files[0],
                                stage.description
                              );
                            }
                          }}
                          className="max-w-xs"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionEditor;