'use client';

/**
 * CreateNoticiaDialog
 *
 * Dialog form for creating a new noticia.
 * Supports general news (no fondo) or fund-specific.
 *
 * @see NEWS-001
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createNoticia } from '@/lib/actions/noticias/noticias-actions';

interface CreateNoticiaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondos: { id: string; nombre: string }[];
}

export function CreateNoticiaDialog({ open, onOpenChange, fondos }: CreateNoticiaDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [fondoId, setFondoId] = useState<string>('');

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setImagenUrl('');
    setFondoId('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createNoticia({
        titulo,
        contenido,
        imagenUrl: imagenUrl || undefined,
        fondoId: fondoId || null,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      resetForm();
      onOpenChange(false);
      router.refresh();
    } catch {
      setError('Error al crear la noticia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const inputStyles =
    'w-full rounded-lg border px-4 py-3 text-sm transition-colors border-input-border bg-input-bg text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva Noticia</DialogTitle>
          <DialogDescription>
            Crea una noticia para un fondo específico o una comunicación general.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <label htmlFor="titulo" className="text-card-foreground block text-sm font-medium">
              Título <span className="text-error">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
              placeholder="Título de la noticia"
              required
              className={inputStyles}
              data-testid="noticia-titulo"
            />
          </div>

          {/* Contenido */}
          <div className="space-y-1.5">
            <label htmlFor="contenido" className="text-card-foreground block text-sm font-medium">
              Contenido <span className="text-error">*</span>
            </label>
            <textarea
              id="contenido"
              value={contenido}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContenido(e.target.value)}
              placeholder="Escribe el contenido de la noticia..."
              rows={5}
              required
              className={`${inputStyles} resize-none`}
              data-testid="noticia-contenido"
            />
          </div>

          {/* Imagen URL */}
          <div className="space-y-1.5">
            <label htmlFor="imagenUrl" className="text-card-foreground block text-sm font-medium">
              URL de Imagen (opcional)
            </label>
            <input
              id="imagenUrl"
              type="url"
              value={imagenUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImagenUrl(e.target.value)}
              placeholder="https://..."
              className={inputStyles}
              data-testid="noticia-imagen"
            />
          </div>

          {/* Fondo Selector */}
          <div className="space-y-1.5">
            <label htmlFor="fondoId" className="text-card-foreground block text-sm font-medium">
              Fondo
            </label>
            <select
              id="fondoId"
              value={fondoId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFondoId(e.target.value)}
              className={inputStyles}
              data-testid="noticia-fondo"
            >
              <option value="">General (todos los fondos)</option>
              {fondos.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
            <p className="text-muted-foreground text-xs">
              Deja vacío para una noticia visible en todos los fondos
            </p>
          </div>

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="submit-noticia">
              {isSubmitting ? 'Creando...' : 'Crear Noticia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
