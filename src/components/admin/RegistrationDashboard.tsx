// types/user.ts
interface UserRegistration {
    id: string;
    name: string;
    email: string;
    teamName: string;
    registrationDate: string;
    status: 'pending' | 'approved' | 'rejected';
    paymentStatus: 'unpaid' | 'pending' | 'paid';
    teamMembers: string[];
    institution: string;
  }
  
  // components/admin/RegistrationDashboard.tsx
  import { useState } from 'react';
  import { Search, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
  
  interface RegistrationDashboardProps {
    registrations: UserRegistration[];
    onStatusChange: (id: string, status: UserRegistration['status']) => void;
    onExportData: () => void;
  }
  
  export function RegistrationDashboard({ 
    registrations, 
    onStatusChange,
    onExportData 
  }: RegistrationDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserRegistration['status'] | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState<UserRegistration['paymentStatus'] | 'all'>('all');
  
    const filteredRegistrations = registrations.filter(reg => {
      const matchesSearch = 
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || reg.paymentStatus === paymentFilter;
  
      return matchesSearch && matchesStatus && matchesPayment;
    });
  
    const getStatusIcon = (status: UserRegistration['status']) => {
      switch (status) {
        case 'approved':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'rejected':
          return <XCircle className="w-5 h-5 text-red-500" />;
        default:
          return <Clock className="w-5 h-5 text-yellow-500" />;
      }
    };
  
    const getPaymentStatusColor = (status: UserRegistration['paymentStatus']) => {
      switch (status) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-red-100 text-red-800';
      }
    };
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registration Management</h1>
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
  
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search registrations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserRegistration['status'] | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as UserRegistration['paymentStatus'] | 'all')}
          >
            <option value="all">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
  
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{registration.teamName}</div>
                    <div className="text-sm text-gray-500">{registration.teamMembers.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{registration.name}</div>
                    <div className="text-sm text-gray-500">{registration.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {registration.institution}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {registration.registrationDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(registration.paymentStatus)}`}>
                      {registration.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(registration.status)}
                      <span className="text-sm text-gray-900 capitalize">{registration.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={registration.status}
                      onChange={(e) => onStatusChange(registration.id, e.target.value as UserRegistration['status'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  // Example usage in a page:
  export default function AdminDashboardPage() {
    const sampleRegistrations: UserRegistration[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        teamName: 'Team Alpha',
        registrationDate: '2024-02-06',
        status: 'pending',
        paymentStatus: 'unpaid',
        teamMembers: ['John Doe', 'Jane Smith', 'Bob Johnson'],
        institution: 'University of Example'
      },
      // Add more sample data as needed
    ];
  
    const handleStatusChange = (id: string, status: UserRegistration['status']) => {
      console.log('Status changed:', id, status);
      // Implement status update logic
    };
  
    const handleExportData = () => {
      console.log('Exporting data...');
      // Implement export logic
    };
  
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegistrationDashboard
            registrations={sampleRegistrations}
            onStatusChange={handleStatusChange}
            onExportData={handleExportData}
          />
        </div>
      </div>
    );
  }