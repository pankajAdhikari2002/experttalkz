import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch('/api/admin/courses?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setCourses((prev) => prev.filter((c: any) => c.id !== id));
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const token = localStorage.getItem('expertTalkz_auth_token');
      const newStatus = currentStatus === 1 ? 0 : 1;
      const res = await fetch(`/api/admin/courses/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c: any) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-black hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Course
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900 text-xs uppercase text-gray-400 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium">Course</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">Loading...</td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">No courses found.</td>
              </tr>
            ) : (
              courses.map((course: any) => (
                <tr key={course.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="h-10 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-gray-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-500">image</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{course.course_name}</div>
                        <div className="text-xs text-gray-500">{course.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {course.is_free ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      <span>₹{course.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                        course.status === 1
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      }`}
                    >
                      {course.status === 1 ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="rounded bg-gray-700 p-1.5 text-gray-400 hover:bg-gray-600 hover:text-white"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="rounded bg-gray-700 p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
