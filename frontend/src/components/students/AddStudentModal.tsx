import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudents } from '../../hooks/useStudents';

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStudentModal({ open, onClose }: AddStudentModalProps) {
  const { addStudent } = useStudents();
  const [form, setForm] = useState({ name: '', rollNumber: '', class: '', parentContact: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    if (!form.class.trim()) e.class = 'Class is required';
    if (!form.parentContact.trim()) e.parentContact = 'Parent contact is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addStudent(form);
    setForm({ name: '', rollNumber: '', class: '', parentContact: '' });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm({ name: '', rollNumber: '', class: '', parentContact: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy-900 dark:text-white">Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {[
            { id: 'name', label: 'Full Name', placeholder: 'e.g. Aarav Sharma' },
            { id: 'rollNumber', label: 'Roll Number', placeholder: 'e.g. 011' },
            { id: 'class', label: 'Class & Section', placeholder: 'e.g. 10-A' },
            { id: 'parentContact', label: 'Parent Contact', placeholder: 'e.g. +91 98765 43210' },
          ].map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-navy-700 dark:text-navy-200 font-medium text-sm">
                {field.label}
              </Label>
              <Input
                id={field.id}
                placeholder={field.placeholder}
                value={form[field.id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                className={errors[field.id] ? 'border-red-400' : ''}
              />
              {errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id]}</p>}
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" className="bg-edu-accent hover:bg-edu-accent-dark text-white">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
