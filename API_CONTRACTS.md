# API Contracts for Frontend

Base URL: `https://nba-api-production-1f32.up.railway.app`

## Standard Response Envelope

All endpoints return:
```json
{
  "meta": {
    "owner_id": "string",
    "snapshot_date": "ISO datetime",
    "from_cache": boolean,
    "last_sync_at": "ISO datetime"
  },
  "data": { ... } | null,
  "errors": [...],
  "capabilities": { ... }
}
```

---

## READ Endpoints (No Yahoo API calls)

### 1. GET /v1/context
Returns all leagues for the owner.

**Response data:**
```json
{
  "owner_id": "z4avmc9",
  "leagues_count": 62,
  "active_league_key": "454.l.84558" | null,
  "active_team_key": "454.l.84558.t.5" | null,
  "sync_status": { ... },
  "leagues": [
    {
      "league_key": "454.l.84558",
      "league_id": "84558",
      "name": "I live for this NBA",
      "season": 2024,
      "game_key": "454",
      "scoring_type": "head",
      "num_teams": 12,
      "current_week": 21,  // can be number or string
      "url": "https://...",
      "logo_url": "https://..." | "false"
    }
  ]
}
```

---

### 2. GET /v1/league-teams?league_key=X
Returns teams for a specific league.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "teams_count": 12,
  "sync_status": { ... },
  "teams": [
    {
      "team_key": "454.l.84558.t.3",
      "team_id": "3",
      "name": "Big Sota",
      "manager_id": "3",
      "manager_name": "jesus alberto",
      "logo_url": "https://..."
    }
  ]
}
```

---

### 3. GET /v1/matchups?league_key=X&team_key=Y&week=Z (optional)
Returns matchups for a team.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "week": 21,
  "current_week": 21,
  "matchups": [
    {
      "week": "21",
      "week_start": "2025-03-24",
      "week_end": "2025-03-30",
      "status": "postevent",
      "is_playoffs": 1,
      "is_consolation": 0,
      "is_tied": 0,
      "is_matchup_of_the_week": 0,
      "winner_team_key": "454.l.84558.t.5",
      "stat_winners": { ... },
      "0": {
        "teams": {
          "0": { "team": [...] },
          "1": { "team": [...] },
          "count": 2
        }
      }
    }
  ]
}
```

**Team structure inside matchup (nested in .0.teams.0.team and .0.teams.1.team):**
Each team is an array with two elements:
- `team[0]`: Array of team info objects (team_key, name, logo, managers, etc.)
- `team[1]`: Object with team_stats, team_points, team_remaining_games

---

### 4. GET /v1/standings?league_key=X
Returns standings for a league.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "week": 21,
  "teams_count": 12,
  "teams": [
    {
      "team_key": "454.l.84558.t.2",
      "team_id": "2",
      "name": "El diablo a caballo",
      "logo_url": "https://...",
      "managers": [...],
      "team_stats": { ... },
      "team_points": { ... },
      "team_standings": {
        "rank": 1,
        "playoff_seed": "4",
        "outcome_totals": {
          "wins": "92",
          "losses": "85",
          "ties": "3",
          "percentage": ".519"
        },
        "games_back": "10.5"
      }
    }
  ]
}
```

---

### 5. GET /v1/settings?league_key=X
Returns league settings.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "league_name": "I live for this NBA",
  "season": 2024,
  "game_code": "nba",
  "scoring_type": "head",
  "is_categories": true,
  "is_points": false,
  "has_categories": true,
  "has_team_stats": true,
  "has_player_pool": true,
  "has_schedule": true,
  "num_teams": 12,
  "num_playoff_teams": 6,
  "playoff_start_week": 20,
  "current_week": 21,
  "start_week": 1,
  "end_week": 21,
  "start_date": "2024-10-22",
  "end_date": "2025-03-30",
  "trade_end_date": "2025-02-06",
  "trade_ratify_type": "commish",
  "waiver_type": "R",
  "waiver_rule": "gametime",
  "uses_faab": false,
  "uses_playoff": true,
  "stat_categories": [
    {
      "stat_id": 0,
      "name": "Field Goals Made / Field Goals Attempted",
      "display_name": "FGM/A",
      "sort_order": 1,
      "is_only_display_stat": true,
      "position_type": "P"
    }
  ],
  "roster_positions": [
    {
      "position": "PG",
      "position_type": "P",
      "count": 1,
      "is_starting_position": true
    }
  ]
}
```

---

### 6. GET /v1/player-pool?league_key=X
Returns free agents with schedule enrichment.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "sport": "nba",
  "players_count": 100,
  "week_info": { ... },
  "schedule_info": { ... },
  "players": [
    {
      "player_key": "454.p.4152",
      "player_id": "4152",
      "name": {
        "full": "Kyle Lowry",
        "first": "Kyle",
        "last": "Lowry"
      },
      "editorial_team_full_name": "Philadelphia 76ers",
      "editorial_team_abbr": "PHI",
      "display_position": "PG",
      "primary_position": "PG",
      "headshot": { "url": "...", "size": "small" },
      "image_url": "...",
      "eligible_positions": [{ "position": "PG" }, { "position": "Util" }],
      "games_week_total": 4,
      "games_remaining_week": 0,
      "games_by_day": {
        "2025-03-24": 1,
        "2025-03-25": 0,
        ...
      },
      "next_games": [],
      "schedule_available": true,
      "next_game": null
    }
  ],
  "raw": { ... }
}
```

---

### 7. GET /v1/roster?team_key=X
Returns roster for a team with schedule enrichment.

**Note:** Returns error if no snapshot exists. Must sync first.

**Response data (when available):**
```json
{
  "team_key": "454.l.84558.t.5",
  "league_key": "454.l.84558",
  "players_count": 13,
  "players": [
    {
      "player_key": "454.p.6015",
      "name": { "full": "...", "first": "...", "last": "..." },
      "display_position": "PG",
      "selected_position": { "position": "PG" },
      "games_week_total": 4,
      "games_remaining_week": 0,
      "schedule_available": true
    }
  ]
}
```

---

### 8. GET /v1/schedule?league_key=X&sport=nba&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
Returns league schedule info.

**Response data:**
```json
{
  "league_key": "454.l.84558",
  "schedule": {
    "current_week": "21",
    "start_week": "1",
    "end_week": "21",
    "start_date": "2024-10-22",
    "end_date": "2025-03-30",
    "is_finished": 1
  },
  "raw": { ... }
}
```

---

### 9. GET /v1/sports-schedule?sport=nba&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
Returns NBA/NFL/MLB games from BallDontLie API.

**Response data:**
```json
{
  "sport": "nba",
  "start_date": "2025-01-01",
  "end_date": "2025-01-07",
  "games_count": 42,
  "games": [
    {
      "game_id": "12345",
      "date": "2025-01-01",
      "home_team": "LAL",
      "away_team": "BOS",
      "home_team_full": "Los Angeles Lakers",
      "away_team_full": "Boston Celtics",
      "status": "Final",
      "home_score": 110,
      "away_score": 105
    }
  ]
}
```

---

### 10. GET /v1/sync-status
Returns sync status for all domains.

---

## Key Notes for Frontend

1. **current_week** can be number OR string - handle both
2. **logo_url** can be "false" string - treat as null
3. **Matchups structure is deeply nested** - teams are in `.0.teams.0.team` and `.0.teams.1.team`
4. **Team info is an array** - first element has metadata, second has stats
5. **No /v1/waivers endpoint** - use /v1/player-pool for free agents
6. **No /v1/managers endpoint** - use /v1/league-managers instead
7. **Roster requires sync** - will return error if no snapshot exists
