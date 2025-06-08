import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppointments, useDeleteMutation, useCreateMutation } from '@/hooks/useSupabaseQuery';
import AppointmentForm from './AppointmentForm';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface AppointmentListProps {
  businessType: BusinessType;
}

const AppointmentList = ({ businessType }: AppointmentListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: appointments, isLoading } = useAppointments(businessType);
  const deleteMutation = useDeleteMutation('appointments', ['appointments']);
  const createMutation = useCreateMutation('appointments', ['appointments']);

  const filteredAppointments = appointments?.filter(appointment =>
    appointment.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleExport = () => {
    if (!appointments || appointments.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no appointments to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Appointment Number', 'Patient', 'Date', 'Type', 'Appointed To', 'Duration', 'Status'];
    const csvContent = [
      headers.join(','),
      ...appointments.map(appointment => [
        appointment.appointment_number,
        `"${appointment.customers?.name || 'N/A'}"`,
        appointment.appointment_date,
        appointment.appointment_type || '',
        appointment.appointed_to || '',
        appointment.duration_minutes || 0,
        appointment.status || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${businessType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Appointments exported to CSV successfully",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const appointment = {
            appointment_number: values[0] || `APT${Date.now()}${i}`,
            appointment_date: values[2] || new Date().toISOString().split('T')[0],
            appointment_type: values[3] || 'consultation',
            appointed_to: values[4] || '',
            duration_minutes: parseInt(values[5]) || 30,
            status: values[6] || 'scheduled',
            business_type: businessType
          };

          await createMutation.mutateAsync(appointment);
        }

        toast({
          title: "Import successful",
          description: `${lines.length - 1} appointments imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import appointments. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  if (isLoading) return <div>Loading appointments...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Appointments</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-appointments"
              />
              <Button variant="outline" asChild>
                <label htmlFor="import-appointments" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search appointments..."
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
              <TableHead>Appointment #</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Appointed To</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.appointment_number}</TableCell>
                <TableCell>{appointment.customers?.name || 'N/A'}</TableCell>
                <TableCell>{appointment.appointment_date}</TableCell>
                <TableCell>{appointment.appointment_type}</TableCell>
                <TableCell>{appointment.appointed_to}</TableCell>
                <TableCell>{appointment.duration_minutes} min</TableCell>
                <TableCell>
                  <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No appointments found. Schedule your first appointment to get started.
          </div>
        )}
      </CardContent>

      <AppointmentForm
        open={showForm}
        onClose={handleCloseForm}
        businessType={businessType}
        appointment={editingAppointment}
      />
    </Card>
  );
};

export default AppointmentList;