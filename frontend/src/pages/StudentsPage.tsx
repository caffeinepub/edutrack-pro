import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Users } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { Student } from '../types/student';
import StudentCard from '../components/students/StudentCard';
import AddStudentModal from '../components/students/AddStudentModal';
import EditStudentModal from '../components/students/EditStudentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoleGuard from '../components/RoleGuard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function StudentsPage() {
  const { students, deleteStudent } = useStudents();
  const [search, setSearch] = useState('');
  const [rollFilter, setRollFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchName = s.name.toLowerCase().includes(search.toLowerCase());
      const matchRoll = rollFilter ? s.rollNumber.toLowerCase().includes(rollFilter.toLowerCase()) : true;
      return matchName && matchRoll;
    });
  }, [students, search, rollFilter]);

  const handleDelete = () => {
    if (deleteId) {
      deleteStudent(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-navy-900 dark:text-white font-bold text-lg">Student Directory</h2>
          <p className="text-navy-500 dark:text-navy-400 text-sm">{students.length} students enrolled</p>
        </div>
        <RoleGuard allowedRoles={['teacher']}>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-edu-accent hover:bg-edu-accent-dark text-white gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </RoleGuard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-600"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            placeholder="Filter by roll no..."
            value={rollFilter}
            onChange={(e) => setRollFilter(e.target.value)}
            className="pl-9 bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-600"
          />
        </div>
      </div>

      {/* Student Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-navy-400">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No students found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={setEditStudent}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <AddStudentModal open={showAdd} onClose={() => setShowAdd(false)} />
      <EditStudentModal student={editStudent} onClose={() => setEditStudent(null)} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
