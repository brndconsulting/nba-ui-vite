/**
 * ErrorState - Componente para mostrar errores de validación de contrato
 * 
 * Soporta dos patrones:
 * 1. Errores de formulario: Array de {code, message, field}
 * 2. Errores de API: String + detalles opcionales
 */
import React from 'react';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copy } from '@/copy/es';

interface FormError {
  code: string;
  message: string;
  field?: string;
}

interface ErrorStateProps {
  errors?: FormError[];
  error?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  errors,
  error,
  timestamp,
  details,
  onRetry,
  compact = false,
}: ErrorStateProps) {
  // Patrón 1: Errores de formulario
  if (errors && errors.length > 0) {
    if (compact) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-md text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errors[0].message}</span>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">{copy.common.errorTitle}</h3>
            <ul className="mt-2 space-y-1 text-sm text-destructive/80">
              {errors.map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Patrón 2: Errores de API
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-md text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error || 'Error desconocido'}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-destructive hover:text-destructive/80"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        Error al cargar datos
      </h3>

      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        {error || 'Ocurrió un error inesperado'}
      </p>

      {timestamp && (
        <p className="text-xs text-muted-foreground mb-4">
          {new Date(timestamp).toLocaleTimeString()}
        </p>
      )}

      {details && Object.keys(details).length > 0 && (
        <details className="w-full max-w-md mb-4">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Detalles técnicos
          </summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
}

/**
 * StaleState - Componente para mostrar que los datos están desactualizados
 */
interface StaleStateProps {
  lastSync: string;
  onRefresh?: () => void;
}

export function StaleState({ lastSync, onRefresh }: StaleStateProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-accent border border-border rounded-md">
      <div className="text-muted-foreground">⚠️</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          Datos desactualizados
        </p>
        <p className="text-xs text-muted-foreground">
          Última sincronización: {new Date(lastSync).toLocaleTimeString()}
        </p>
      </div>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="ghost"
          size="sm"
          className="gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyState - Componente para mostrar que no hay datos
 */
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'Sin datos',
  description = 'No hay datos disponibles en este momento',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * LoadingState - Componente para mostrar que está cargando
 */
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="animate-spin mb-4">
        <div className="text-4xl">⏳</div>
      </div>
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
