-- anniversariesテーブル作成
CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('past', 'future')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 開発用: RLSを無効化
ALTER TABLE anniversaries DISABLE ROW LEVEL SECURITY;
