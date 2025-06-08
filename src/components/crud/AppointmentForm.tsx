import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMutation, useUpdateMutation, useCustomers } from '@/hooks/useSupabaseQuery';
import { Database } from '@/integration/supabase/types';


type BusinessType = Database['public']['Enums']['business_type'];

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  businessType: BusinessType;
  appointment?: any;
}

const AppointmentForm = ({ open, onClose, businessType, appointment }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    appointment_number: '',
    appointment_date: '',
    appointment_type: '',
    customer_id: '',
    appointed_to: '',
    duration_minutes: '',
    status: 'scheduled',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    follow_up_date: '',
    notes: ''
  });

  const createMutation = useCreateMutation('appointments', ['appointments']);
  const updateMutation = useUpdateMutation('appointments', ['appointments']);
  const { data: patients } = useCustomers(businessType);

  useEffect(() => {
    if (appointment) {
      setFormData({ 
        ...appointment,
        duration_minutes: appointment.duration_minutes?.toString() || '',
        customer_id: appointment.customer_id || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        appointment_number: `APT-${Date.now()}`,
        appointment_date: today,
        appointment_type: getDefaultAppointmentType(),
        customer_id: '',
        appointed_to: '',
        duration_minutes: '30',
        status: 'scheduled',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        follow_up_date: '',
        notes: ''
      });
    }
  }, [appointment, open, businessType]);

  const getDefaultAppointmentType = () => {
    switch (businessType) {
      case 'Hospital':
        return 'consultation';
      case 'Medical Store':
        return 'consultation';
      default:
        return 'meeting';
    }
  };

  const getAppointmentTypes = () => {
    switch (businessType) {
      case 'Hospital':
        return [
          { value: 'consultation', label: 'Consultation' },
          { value: 'follow_up', label: 'Follow-up' },
          { value: 'surgery', label: 'Surgery' },
          { value: 'diagnostic', label: 'Diagnostic' },
          { value: 'emergency', label: 'Emergency' }
        ];
      case 'Medical Store':
        return [
          { value: 'consultation', label: 'Consultation' },
          { value: 'prescription_review', label: 'Prescription Review' },
          { value: 'health_checkup', label: 'Health Checkup' }
        ];
      default:
        return [
          { value: 'meeting', label: 'Meeting' },
          { value: 'consultation', label: 'Consultation' },
          { value: 'presentation', label: 'Presentation' }
        ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id) {
      alert('Please select a patient');
      return;
    }

    const dataToSubmit = {
      ...formData,
      business_type: businessType,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      customer_id: formData.customer_id
    };

    if (appointment) {
      await updateMutation.mutateAsync({ id: appointment.id, data: dataToSubmit });
    } else {
      await createMutation.mutateAsync(dataToSubmit);
    }
    onClose();
  };

  const getTitle = () => {
    switch (businessType) {
      case 'Hospital':
        return appointment ? 'Edit Patient Appointment' : 'Schedule Patient Appointment';
      case 'Medical Store':
        return appointment ? 'Edit Consultation' : 'Schedule Consultation';
      default:
        return appointment ? 'Edit Appointment' : 'Schedule Appointment';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointment_number">Appointment Number</Label>
              <Input
                id="appointment_number"
                value={formData.appointment_number}
                onChange={(e) => setFormData({ ...formData, appointment_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="appointment_date">Date</Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_id">Patient *</Label>
            <Select 
              value={formData.customer_id} 
              onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointment_type">Type</Label>
              <Select value={formData.appointment_type} onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {getAppointmentTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointed_to">Appointed To</Label>
              <Input
                id="appointed_to"
                value={formData.appointed_to}
                onChange={(e) => setFormData({ ...formData, appointed_to: e.target.value })}
                placeholder="Doctor/Staff name"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(businessType === 'Hospital' || businessType === 'Medical Store') && (
            <>
              <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
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
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prescription">Prescription</Label>
                  <Textarea
                    id="prescription"
                    value={formData.prescription}
                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="follow_up_date">Follow-up Date</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {appointment ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;