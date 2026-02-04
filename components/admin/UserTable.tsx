'use client';

/**
 * UserTable Component
 *
 * Admin table for user management following the dashboard pattern:
 * - Header + description outside card
 * - Filter bar with search, role filter, and action button
 * - Table in sidebar-colored container with integrated pagination
 *
 * @see CRUD-002
 */

import { useState, useMemo } from 'react';
import { Plus, Eye, Pencil, Trash2, Mail } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableColumn } from '@/components/ui/Table';
import { TableFilter } from '@/components/ui/TableFilter';
import { TableSearch } from '@/components/ui/TableExtras';
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
import { UserListItem, deleteUser } from '@/lib/actions/admin/user-admin';
import { getRoleDisplayName, isSuperAdmin, ROLES } from '@/src/config/roles';
import { toast } from 'sonner';
import { UserFormDialog } from './UserFormDialog';
import { InviteUserDialog } from './InviteUserDialog';

// =============================================================================
// Types
// =============================================================================

interface UserTableProps {
  /** Users data from server */
  users: UserListItem[];
  /** Current user's role for permission checks */
  currentUserRole: string;
  /** Current user's ID (for self-delete prevention) */
  currentUserId: string;
  /** Whether email is configured (show invite button) */
  canInvite?: boolean;
}

type UserForEdit = Pick<UserListItem, 'id' | 'name' | 'email' | 'role'>;

// Filter options with colors
const roleOptions = [
  { value: ROLES.SUPER_ADMIN, label: 'Super Admin', color: '#ef4444' },
  { value: ROLES.ADMIN_FONDO, label: 'Administrador de Fondo', color: '#3b82f6' },
  { value: ROLES.AGENTE, label: 'Agente', color: '#6b7280' },
];

// =============================================================================
// Helper Functions
// =============================================================================

function getInitials(name: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRoleColor(role: string): string {
  return roleOptions.find((r) => r.value === role)?.color || '#6b7280';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// =============================================================================
// Component
// =============================================================================

export function UserTable({
  users,
  currentUserRole,
  currentUserId,
  canInvite = false,
}: UserTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserForEdit | null>(null);
  const [viewUser, setViewUser] = useState<UserListItem | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          (user.name?.toLowerCase().includes(searchLower) ?? false) ||
          user.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Role filter (multi)
      if (roleFilter.length > 0 && !roleFilter.includes(user.role)) {
        return false;
      }

      return true;
    });
  }, [users, search, roleFilter]);

  // Handle delete confirmation
  async function handleDelete() {
    if (!deleteUserId) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(deleteUserId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Usuario eliminado correctamente');
      }
    } catch {
      toast.error('Error al eliminar usuario');
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  }

  // Table columns
  const columns: TableColumn<UserListItem>[] = [
    {
      id: 'name',
      header: 'Usuario',
      sortable: true,
      accessor: (user: UserListItem) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">{user.name || '—'}</p>
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
      accessor: (user: UserListItem) => {
        const roleColor = getRoleColor(user.role);
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${roleColor}20`, color: roleColor }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: roleColor }} />
            {getRoleDisplayName(user.role)}
          </span>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Fecha',
      sortable: true,
      className: 'hidden lg:table-cell text-muted-foreground',
      accessor: (user: UserListItem) => formatDate(user.createdAt),
    },
    {
      id: 'actions',
      header: 'Acciones',
      className: 'text-right',
      accessor: (user: UserListItem) => {
        const isSelf = user.id === currentUserId;
        const isTargetSuperAdmin = isSuperAdmin(user.role);
        const canDelete = !isSelf && !isTargetSuperAdmin;

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
              title="Ver"
              onClick={() => setViewUser(user)}
            >
              <Eye className="text-muted-foreground h-4 w-4" />
            </button>
            <button
              className="hover:bg-secondary rounded-lg p-1.5 transition-colors"
              title="Editar"
              onClick={() =>
                setEditUser({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                })
              }
            >
              <Pencil className="text-muted-foreground h-4 w-4" />
            </button>
            {canDelete && (
              <button
                className="hover:bg-destructive/10 rounded-lg p-1.5 transition-colors"
                title="Eliminar"
                onClick={() => setDeleteUserId(user.id)}
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header - On page background (no card) */}
      <div>
        <h2 className="text-foreground text-lg font-semibold">Usuarios</h2>
        <p className="text-muted-foreground text-sm">Gestión de usuarios del sistema</p>
      </div>

      {/* Filter Bar - On page background */}
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          {canInvite && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="border-input bg-background hover:bg-secondary flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              Invitar
            </button>
          )}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
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
          pageSize={20}
          showSearch={false}
          showPagination={true}
          alwaysShowPagination={true}
          emptyMessage="No hay usuarios para mostrar"
          className="rounded-none border-0 shadow-none"
        />
      </div>

      {/* Create Dialog */}
      <UserFormDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        currentUserRole={currentUserRole}
      />

      {/* Invite Dialog */}
      <InviteUserDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

      {/* Edit Dialog */}
      {editUser && (
        <UserFormDialog
          mode="edit"
          open={true}
          onOpenChange={(open: boolean) => !open && setEditUser(null)}
          currentUserRole={currentUserRole}
          user={editUser}
        />
      )}

      {/* View Dialog (simple info) */}
      {viewUser && (
        <AlertDialog open={true} onOpenChange={(open: boolean) => !open && setViewUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{viewUser.name || 'Usuario'}</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2 text-left">
                  <p>
                    <strong>Email:</strong> {viewUser.email}
                  </p>
                  <p>
                    <strong>Rol:</strong> {getRoleDisplayName(viewUser.role)}
                  </p>
                  <p>
                    <strong>Creado:</strong> {formatDate(viewUser.createdAt)}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open: boolean) => !open && setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será desactivado del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
