import {
  Home,
  Settings,
  Building2,
  Users,
  ArrowRightLeft,
  Wand2,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

/**
 * Navigation Configuration
 *
 * Centralized navigation config used by Sidebar and MobileDrawer.
 * Includes role-based filtering support.
 */

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  collapsible?: boolean;
  roles?: string[];
  children?: NavItem[];
}

/**
 * Main navigation items
 * - roles: if defined, item only visible to users with matching role
 * - collapsible: if true, item can expand/collapse to show children
 */
export const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Fondos',
    href: '/fondos',
    icon: Building2,
  },
  {
    name: 'Inversionistas',
    href: '/inversionistas',
    icon: Users,
  },
  {
    name: 'Movimientos',
    href: '/movimientos',
    icon: ArrowRightLeft,
  },
  {
    name: 'Noticias',
    href: '/noticias',
    icon: Newspaper,
  },
  {
    name: 'Wizard de Reparto',
    href: '/wizard',
    icon: Wand2,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    collapsible: true,
    roles: ['admin_fondo', 'super_admin'],
    children: [
      {
        name: 'General',
        href: '/settings/general',
        icon: Settings,
        roles: ['admin_fondo', 'super_admin'],
      },
      {
        name: 'Usuarios',
        href: '/settings/users',
        icon: Settings,
        roles: ['admin_fondo', 'super_admin'],
      },
    ],
  },
];

/**
 * Filter navigation items based on user role
 * @param items - Navigation items to filter
 * @param userRole - Current user's role
 * @returns Filtered navigation items
 */
export function filterNavigationByRole(items: NavItem[], userRole?: string): NavItem[] {
  return items
    .filter((item) => {
      // No roles defined = visible to all
      if (!item.roles || item.roles.length === 0) return true;
      // Check if user has required role
      return userRole && item.roles.includes(userRole);
    })
    .map((item) => ({
      ...item,
      // Recursively filter children
      children: item.children ? filterNavigationByRole(item.children, userRole) : undefined,
    }))
    .filter((item) => {
      // Remove collapsible items with no children after filtering
      if (item.collapsible && (!item.children || item.children.length === 0)) return false;
      return true;
    });
}
