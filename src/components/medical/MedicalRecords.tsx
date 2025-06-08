import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, FileText, User, Calendar, Heart } from 'lucide-react';
import { useMedicalRecords, useCreateMutation, useUpdateMutation, useDeleteMutation, useCustomers } from '@/hooks/useSupabaseQuery';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';


type BusinessType = Database['public']['Enums']['business_type'];

interface MedicalRecordsProps {
  businessType: BusinessType;
}

const MedicalRecords = ({ businessType }: MedicalRecordsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    allergies: '',
    medical_history: '',
    current_medications: '',
    diagnosis: '',
    notes: '',
    status: 'Active'
  });

  const { data: medicalRecords, isLoading } = useMedicalRecords(businessType);
  const { data: patients } = useCustomers(businessType);
  const createMutation = useCreateMutation('medical_records', ['medical_records']);
  const updateMutation = useUpdateMutation('medical_records', ['medical_records']);
  const deleteMutation = useDeleteMutation('medical_records', ['medical_records']);

  const resetForm = () => {
    setFormData({
      patient_id: '',
      patient_name: '',
      date_of_birth: '',
      gender: '',
      blood_type: '',
      allergies: '',
      medical_history: '',
      current_medications: '',
      diagnosis: '',
      notes: '',
      status: 'Active'
    });
  };

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients?.find(p => p.id === patientId);
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patient_id: patientId,
        patient_name: selectedPatient.name,
        date_of_birth: selectedPatient.date_of_birth || '',
        gender: selectedPatient.gender || ''
      }));
    }
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setFormData({
      patient_id: record.patient_id || '',
      patient_name: record.patient_name || '',
      date_of_birth: record.date_of_birth || '',
      gender: record.gender || '',
      blood_type: record.blood_type || '',
      allergies: record.allergies || '',
      medical_history: record.medical_history || '',
      current_medications: record.current_medications || '',
      diagnosis: record.diagnosis || '',
      notes: record.notes || '',
      status: record.status || 'Active'
    });
    setShowEditDialog(true);
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setShowViewDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Medical record deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting medical record:', error);
        toast({
          title: "Error",
          description: "Failed to delete medical record",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    if (!formData.patient_name.trim()) {
      toast({
        title: "Error",
        description: "Patient name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        business_type: businessType,
        date_of_birth: formData.date_of_birth || null
      };

      await createMutation.mutateAsync(submitData);
      setShowCreateDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Medical record created successfully",
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
      toast({
        title: "Error",
        description: "Failed to create medical record",
        variant: "destructive",
      });
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_name.trim()) {
      toast({
        title: "Error",
        description: "Patient name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        business_type: businessType,
        date_of_birth: formData.date_of_birth || null
      };

      await updateMutation.mutateAsync({ 
        id: selectedRecord.id, 
        data: submitData 
      });
      setShowEditDialog(false);
      setSelectedRecord(null);
      resetForm();
      toast({
        title: "Success",
        description: "Medical record updated successfully",
      });
    } catch (error) {
      console.error('Error updating medical record:', error);
      toast({
        title: "Error",
        description: "Failed to update medical record",
        variant: "destructive",
      });
    }
  };

  const filteredRecords = medicalRecords?.filter(record =>
    record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <div>Loading medical records...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Records
            </CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Medical Record
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.patient_name}</TableCell>
                  <TableCell>{record.date_of_birth}</TableCell>
                  <TableCell>{record.gender}</TableCell>
                  <TableCell>{record.blood_type}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'Active' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(record)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No medical records found. Create your first medical record to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Medical Record Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Medical Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div>
              <Label htmlFor="patient_id">Patient *</Label>
              <Select 
                value={formData.patient_id} 
                onValueChange={handlePatientSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.customer_code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                  disabled
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blood_type">Blood Type</Label>
               <Select value={formData.blood_type} onValueChange={(value) => setFormData({ ...formData, blood_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea
                id="medical_history"
                value={formData.medical_history}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="current_medications">Current Medications</Label>
              <Textarea
                id="current_medications"
                value={formData.current_medications}
                onChange={(e) => setFormData({ ...formData, current_medications: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Medical Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Medical Record Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medical Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blood_type">Blood Type</Label>
              <Input
                id="blood_type"
                value={formData.blood_type}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea
                id="medical_history"
                value={formData.medical_history}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="current_medications">Current Medications</Label>
              <Textarea
                id="current_medications"
                value={formData.current_medications}
                onChange={(e) => setFormData({ ...formData, current_medications: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Medical Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Medical Record Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient Name</Label>
              <Input value={selectedRecord?.patient_name} disabled />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input value={selectedRecord?.date_of_birth} disabled />
            </div>
            <div>
              <Label>Gender</Label>
              <Input value={selectedRecord?.gender} disabled />
            </div>
            <div>
              <Label>Blood Type</Label>
              <Input value={selectedRecord?.blood_type} disabled />
            </div>
            <div>
              <Label>Allergies</Label>
              <Textarea value={selectedRecord?.allergies} disabled />
            </div>
            <div>
              <Label>Medical History</Label>
              <Textarea value={selectedRecord?.medical_history} disabled />
            </div>
            <div>
              <Label>Current Medications</Label>
              <Textarea value={selectedRecord?.current_medications} disabled />
            </div>
            <div>
              <Label>Diagnosis</Label>
              <Textarea value={selectedRecord?.diagnosis} disabled />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={selectedRecord?.notes} disabled />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={selectedRecord?.status} disabled />
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;