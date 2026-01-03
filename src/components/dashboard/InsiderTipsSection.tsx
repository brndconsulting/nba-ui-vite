import React from 'react';
import { useInsiderTips } from '@/hooks/useInsiderTips';
import { InsiderCard } from './InsiderCard';
import {
  InsiderLoadingState,
  InsiderMissingState,
  InsiderEmptyState,
  InsiderComingSoonState,
  InsiderStaleState,
  InsiderErrorState,
} from './InsiderStates';

interface InsiderTipsSectionProps {
  leagueKey: string;
  teamKey: string;
}

export const InsiderTipsSection: React.FC<InsiderTipsSectionProps> = ({
  leagueKey,
  teamKey,
}) => {
  const { data, loading, generatedAt } = useInsiderTips(
    leagueKey,
    teamKey
  );

  // Render individual card based on status
  const renderCard = (cardData: typeof data[0]) => {
    switch (cardData.status) {
      case 'ready':
        return (
          <InsiderCard
            key={cardData.id}
            {...cardData}
            generatedAt={generatedAt || undefined}
          />
        );

      case 'missing_inputs':
        return (
          <InsiderMissingState
            key={cardData.id}
            title={cardData.title}
            reason={cardData.summary}
            domains={
              cardData.evidence?.inputs.map((i) => i.domain) || []
            }
          />
        );

      case 'empty':
        return (
          <InsiderEmptyState
            key={cardData.id}
            title={cardData.title}
            message={cardData.summary}
          />
        );

      case 'coming_soon':
        return (
          <InsiderComingSoonState
            key={cardData.id}
            title={cardData.title}
            message={cardData.summary}
          />
        );

      case 'stale':
        return (
          <InsiderStaleState
            key={cardData.id}
            title={cardData.title}
            message={cardData.summary}
            lastSyncAt={
              cardData.evidence?.inputs[0]?.last_sync_at || undefined
            }
          />
        );

      case 'error':
        return (
          <InsiderErrorState
            key={cardData.id}
            title={cardData.title}
            errorId={cardData.error?.error_id}
            message={cardData.error?.message || cardData.summary}
          />
        );

      default:
        return (
          <InsiderMissingState
            key={cardData.id}
            title={cardData.title}
            reason="Unknown state"
          />
        );
    }
  };

  // Loading state: show 4 skeleton cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <InsiderLoadingState key={i} />
        ))}
      </div>
    );
  }

  // Render cards (4 cards in fixed order)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((card) => renderCard(card))}
    </div>
  );
};
