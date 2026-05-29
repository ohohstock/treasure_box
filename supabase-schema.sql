-- 在 Supabase Dashboard > SQL Editor 執行此檔案

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game_scores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  treasure_found BOOLEAN DEFAULT FALSE,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- 排行榜 view：每位玩家的最高分與出賽次數
CREATE VIEW leaderboard AS
SELECT
  u.username,
  MAX(gs.score) AS best_score,
  COUNT(*)::INT AS games_played
FROM game_scores gs
JOIN users u ON u.id = gs.user_id
GROUP BY u.id, u.username
ORDER BY best_score DESC
LIMIT 20;
