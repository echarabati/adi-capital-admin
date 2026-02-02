/**
 * Recent Users Table Component
 *
 * Demonstrates the DataTable component with mock user data and filters.
 */

'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Plus, Eye, Pencil } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableFilter } from '@/components/ui/TableFilter';
import { TableSearch } from '@/components/ui/TableExtras';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock users data (expanded for pagination demo)
const allUsers: User[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '31 oct 2025',
  },
  {
    id: '2',
    name: 'Juan López',
    email: 'juan.lopez@example.com',
    role: 'Usuario',
    status: 'active',
    createdAt: '31 oct 2025',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    role: 'Usuario',
    status: 'inactive',
    createdAt: '31 oct 2025',
  },
  {
    id: '4',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: '30 oct 2025',
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@example.com',
    role: 'Usuario',
    status: 'active',
    createdAt: '30 oct 2025',
  },
  {
    id: '6',
    name: 'Pedro Fernández',
    email: 'pedro.fernandez@example.com',
    role: 'Usuario',
    status: 'active',
    createdAt: '29 oct 2025',
  },
  {
    id: '7',
    name: 'Elena Torres',
    email: 'elena.torres@example.com',
    role: 'Admin',
    status: 'inactive',
    createdAt: '28 oct 2025',
  },
  {
    id: '8',
    name: 'Diego Morales',
    email: 'diego.morales@example.com',
    role: 'Usuario',
    status: 'active',
    createdAt: '27 oct 2025',
  },
  {
    id: '9',
    name: 'Sofía Herrera',
    email: 'sofia.herrera@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: '26 oct 2025',
  },
  {
    id: '10',
    name: 'Miguel Castro',
    email: 'miguel.castro@example.com',
    role: 'Usuario',
    status: 'inactive',
    createdAt: '25 oct 2025',
  },
  {
    id: '11',
    name: 'Carmen Díaz',
    email: 'carmen.diaz@example.com',
    role: 'Usuario',
    status: 'active',
    createdAt: '24 oct 2025',
  },
  {
    id: '12',
    name: 'Roberto Vega',
    email: 'roberto.vega@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '23 oct 2025',
  },
];

// Filter options
const roleOptions = [
  { value: 'Admin', label: 'Admin', color: '#3b82f6' },
  { value: 'Editor', label: 'Editor', color: '#8b5cf6' },
  { value: 'Usuario', label: 'Usuario', color: '#6b7280' },
];

const statusOptions = [
  { value: 'active', label: 'Activo', color: '#22c55e' },
  { value: 'inactive', label: 'Inactivo', color: '#ef4444' },
];

// Column definitions using TableColumn type
const columns: TableColumn<User>[] = [
  {
    id: 'name',
    header: 'Usuario',
    sortable: true,
    accessor: (user) => (
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="min-w-0">
          <p className="text-foreground truncate font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    id: 'role',
    header: 'Rol',
    sortable: true,
    className: 'hidden md:table-cell',
    accessor: (user) => {
      const roleColor = roleOptions.find((r) => r.value === user.role)?.color || '#6b7280';
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${roleColor}20`, color: roleColor }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: roleColor }} />
          {user.role}
        </span>
      );
    },
  },
  {
    id: 'status',
    header: 'Estado',
    sortable: true,
    accessor: (user) =>
      user.status === 'active' ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Activo</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-red-500">
          <XCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Inactivo</span>
        </span>
      ),
  },
  {
    id: 'createdAt',
    header: 'Fecha',
    sortable: true,
    className: 'hidden lg:table-cell text-muted-foreground',
    accessor: 'createdAt',
  },
  {
    id: 'actions',
    header: 'Acciones',
    className: 'text-right',
    accessor: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="hover:bg-secondary rounded-lg p-1.5 transition-colors" title="Ver">
          <Eye className="text-muted-foreground h-4 w-4" />
        </button>
        <button className="hover:bg-secondary rounded-lg p-1.5 transition-colors" title="Editar">
          <Pencil className="text-muted-foreground h-4 w-4" />
        </button>
      </div>
    ),
  },
];

export function RecentUsersTable() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Apply filters to data
  const filteredUsers = allUsers.filter((user) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Role filter (multi)
    if (roleFilter.length > 0 && !roleFilter.includes(user.role)) {
      return false;
    }

    // Status filter (single)
    if (statusFilter && user.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header - On dashboard background (no card) */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Usuarios Recientes</h2>
        <p className="text-muted-foreground text-sm">Gestión de usuarios del sistema</p>
      </div>

      {/* Filter Bar - On dashboard background */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="min-w-48 flex-1 lg:max-w-xs">
          <label className="text-muted-foreground mb-1 block text-xs font-medium tracking-wide uppercase">
            Buscar
          </label>
          <TableSearch value={search} onChange={setSearch} placeholder="Nombre, email..." />
        </div>

        {/* Role Filter (Multi) */}
        <TableFilter
          label="Rol"
          options={roleOptions}
          value={roleFilter}
          onChange={(v) => setRoleFilter(v as string[])}
          mode="multi"
          placeholder="Todos los roles"
          className="min-w-40"
        />

        {/* Status Filter (Single) */}
        <TableFilter
          label="Estado"
          options={statusOptions}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as string)}
          mode="single"
          placeholder="Todos"
          className="min-w-32"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <div className="flex items-end">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Table - Wrapped in sidebar-colored container */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <DataTable
          data={filteredUsers}
          columns={columns}
          keyExtractor={(user) => user.id}
          pageSize={5}
          showSearch={false}
          className="rounded-none border-0 shadow-none"
        />
      </div>
    </div>
  );
}
