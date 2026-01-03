/**
 * Copy centralizado en español
 * Evita typos y permite cambios globales
 */

export const copy = {
  // Matchup
  matchup: {
    title: 'Matchup Actual',
    subtitle: 'Resultados y categorías',
    
    empty: {
      noSnapshot: 'No hay datos de matchup disponibles',
      noData: 'Sin matchup en esta semana',
    },
    
    stale: {
      label: 'Datos desactualizados',
      message: 'Última actualización: {{timestamp}}',
    },
    
    error: {
      invalidPayload: 'Error al cargar los datos del matchup',
      generic: 'Ocurrió un error inesperado',
    },
    
    tabs: {
      summary: 'Resumen',
      categories: 'Categorías',
      details: 'Detalle',
    },
    
    teams: {
      points: 'Puntos',
      vs: 'vs',
    },
    
    categories: {
      name: 'Categoría',
      value: 'Valor',
      result: 'Resultado',
    },
  },

  // Insider Engine
  insider: {
    title: 'Insider',
    subtitle: 'Análisis y recomendaciones',
    
    // Card 1: Estado inmediato
    card1: {
      title_matchup_valid: 'Matchup en progreso',
      body_matchup_valid: 'Tu equipo {{teamName}} vs {{opponentName}}. Puntuación actual: {{points}}',
      title_matchup_stale: 'Datos de matchup desactualizados',
      body_matchup_stale: 'Última actualización: {{lastSyncAt}}. Sincroniza para ver datos recientes.',
      title_matchup_missing: 'Sin datos de matchup',
      body_matchup_missing: 'No hay snapshot válido de matchup. Ejecuta una sincronización.',
    },
    
    // Card 2: Riesgo roster
    card2: {
      title_injuries: 'Alerta de lesiones',
      body_injuries: '{{count}} jugador(es) de tu roster con lesiones recientes: {{players}}',
      title_news: 'Noticias relevantes',
      body_news: 'Hay noticias recientes sobre {{count}} jugador(es) de tu equipo.',
      title_no_alerts: 'Sin alertas recientes',
      body_no_alerts: 'Tu roster está en buen estado. Última verificación: {{lastSyncAt}}',
    },
    
    // Card 3: Oportunidad waiver
    card3: {
      title_candidates: 'Oportunidades en waiver',
      body_candidates: '{{count}} jugador(es) disponibles que podrían mejorar tu equipo: {{players}}',
      title_no_candidates: 'Sin tendencias disponibles',
      body_no_candidates: 'No hay datos de waiver trends. Verifica más tarde.',
    },
    
    // Card 4: Notas jugadores
    card4: {
      title_notes_positive: 'Comentarios positivos',
      body_notes_positive: '{{count}} jugador(es) con notas positivas registradas.',
      title_notes_negative: 'Comentarios negativos',
      body_notes_negative: '{{count}} jugador(es) con notas negativas registradas.',
      title_notes_mixed: 'Comentarios registrados',
      body_notes_mixed: 'Tienes {{count}} comentario(s) registrado(s) sobre jugadores.',
      title_no_notes: 'Sin comentarios registrados',
      body_no_notes: 'No hay notas sobre jugadores. Agrega comentarios para rastrear observaciones.',
    },
    
    // Actions
    actions: {
      view_matchup: 'Ver matchup',
      view_waiver: 'Ver waiver',
      view_roster: 'Ver roster',
      view_sync: 'Ver estado de sync',
    },
    
    // Evidence (debug)
    evidence: {
      label: 'Evidencia',
      domain: 'Dominio',
      lastSyncAt: 'Última sincronización',
      checksum: 'Checksum',
    },
  },

  // Capabilities
  capabilities: {
    scoringType: {
      categories: 'Categorías',
      points: 'Puntos',
    },
  },

  // States
  states: {
    loading: 'Cargando...',
    empty: 'Sin datos',
    error: 'Error',
    stale: 'Datos desactualizados',
  },

  // Waiver/Recommendations
  waiver: {
    title: 'Waiver & Recomendaciones',
    subtitle: 'Decisiones basadas en datos',
    
    empty: {
      noRecommendations: 'Sin recomendaciones disponibles',
      noData: 'Sincroniza para ver recomendaciones',
    },
    
    error: {
      failedToLoad: 'Error al cargar recomendaciones',
      missingSnapshot: 'Falta información de {{domain}}',
    },
    
    stale: {
      label: 'Recomendaciones desactualizadas',
      message: 'Última actualización: {{timestamp}}',
    },
    
    table: {
      player: 'Jugador',
      action: 'Acción',
      reason: 'Razón',
      source: 'Fuente',
      confidence: 'Confianza',
    },
    
    actions: {
      add: 'Agregar',
      drop: 'Soltar',
      addDrop: 'Agregar/Soltar',
      refresh: 'Actualizar',
      viewEvidence: 'Ver evidencia',
    },
    
    sources: {
      yahoo: 'Yahoo',
      user: 'Tuyas',
    },
  },

  // Player Notes
  playerNotes: {
    title: 'Notas de Jugadores',
    subtitle: 'Tus comentarios y observaciones',
    
    empty: {
      noNotes: 'Sin notas registradas',
      addFirst: 'Agrega tu primer comentario',
    },
    
    error: {
      failedToLoad: 'Error al cargar notas',
      failedToSave: 'Error al guardar nota',
    },
    
    form: {
      player: 'Jugador',
      note: 'Comentario',
      sentiment: 'Sentimiento',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
    },
    
    sentiments: {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutral',
    },
  },

  // Decision Layer
  decisions: {
    title: 'Análisis de Decisiones',
    
    reasons: {
      injuryAlert: 'Alerta de lesión',
      trendingUp: 'En tendencia',
      trendingDown: 'Perdiendo valor',
      goodMatchup: 'Buen matchup',
      badMatchup: 'Mal matchup',
      benchDepth: 'Profundidad en banca',
      userNote: 'Nota tuya',
    },
  },

  // General
  general: {
    close: 'Cerrar',
    retry: 'Reintentar',
    back: 'Atrás',
    loading: 'Cargando...',
    noData: 'Sin datos',
  },
};

export type Copy = typeof copy;
