import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { useListUsers, useSetApproval, useAssignRole } from '../hooks/useQueries';

// Define types for the admin dashboard since they're not in the backend yet
interface MockUser {
  principal: { toString: () => string };
  role: { admin?: Record<string, never> } | { user?: Record<string, never> } | { guest?: Record<string, never> };
  approval: { approved?: Record<string, never> } | { rejected?: Record<string, never> } | { pending?: Record<string, never> };
}

export function AdminDashboard() {
  const { data: users = [] } = useListUsers();
  const setApprovalMutation = useSetApproval();
  const assignRoleMutation = useAssignRole();

  const handleApproval = async (userPrincipal: string, approval: 'approved' | 'rejected') => {
    try {
      await setApprovalMutation.mutateAsync({ user: userPrincipal, approval });
    } catch (error) {
      console.error('Failed to update approval:', error);
    }
  };

  const handleRoleChange = async (userPrincipal: string, role: 'admin' | 'user' | 'guest') => {
    try {
      await assignRoleMutation.mutateAsync({ user: userPrincipal, role });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const getApprovalStatus = (user: MockUser) => {
    if ('approved' in user.approval) return 'approved';
    if ('rejected' in user.approval) return 'rejected';
    if ('pending' in user.approval) return 'pending';
    return 'unknown';
  };

  const getUserRole = (user: MockUser) => {
    if ('admin' in user.role) return 'admin';
    if ('user' in user.role) return 'user';
    if ('guest' in user.role) return 'guest';
    return 'unknown';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage users and their access permissions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((user: MockUser) => getApprovalStatus(user) === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((user: MockUser) => getApprovalStatus(user) === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: MockUser) => {
                const userPrincipal = user.principal.toString();
                const approvalStatus = getApprovalStatus(user);
                const userRole = getUserRole(user);

                return (
                  <tr key={userPrincipal}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {userPrincipal.slice(0, 20)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userRole}
                        onChange={(e) => handleRoleChange(userPrincipal, e.target.value as any)}
                        disabled={assignRoleMutation.isPending}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="guest">Guest</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        approvalStatus === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : approvalStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(userPrincipal, 'approved')}
                            disabled={setApprovalMutation.isPending}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(userPrincipal, 'rejected')}
                            disabled={setApprovalMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {approvalStatus === 'rejected' && (
                        <button
                          onClick={() => handleApproval(userPrincipal, 'approved')}
                          disabled={setApprovalMutation.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {approvalStatus === 'approved' && (
                        <button
                          onClick={() => handleApproval(userPrincipal, 'rejected')}
                          disabled={setApprovalMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Yet</h3>
            <p className="text-gray-600">Users will appear here once they register.</p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Note: The multi-user admin system is not yet implemented in the backend. 
                This interface will be functional once the backend includes user management features.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
