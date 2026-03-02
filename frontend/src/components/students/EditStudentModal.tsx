import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Student } from '../../types/student';
import { useStudents } from '../../hooks/useStudents';

interface EditStudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function EditStudentModal({ student, onClose }: EditStudentModalProps) {
  const { updateStudent } = useStudents();
  const [form, setForm] = useState({ name: '', rollNumber: '', class: '', parentContact: '' });

  useEffect(() => {
    if (student) {
      setForm({ name: student.name, rollNumber: student.rollNumber, class: student.class, parentContact: student.parentContact });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    updateStudent(student.id, form);
    onClose();
  };

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy-900 dark:text-white">Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {[
            { id: 'name', label: 'Full Name' },
            { id: 'rollNumber', label: 'Roll Number' },
            { id: 'class', label: 'Class & Section' },
            { id: 'parentContact', label: 'Parent Contact' },
          ].map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={`edit-${field.id}`} className="text-navy-700 dark:text-navy-200 font-medium text-sm">
                {field.label}
              </Label>
              <Input
                id={`edit-${field.id}`}
                value={form[field.id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
              />
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-edu-accent hover:bg-edu-accent-dark text-white">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
