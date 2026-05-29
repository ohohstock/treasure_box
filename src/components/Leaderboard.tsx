import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  username: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function Leaderboard({ open, onClose }: LeaderboardProps) {
  const [, forceUpdate] = useState(0);

  const entries: LeaderboardEntry[] = JSON.parse(localStorage.getItem('leaderboard') ?? '[]');

  const clearAll = () => {
    localStorage.removeItem('leaderboard');
    forceUpdate((n) => n + 1);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">🏆 排行榜（本機紀錄）</DialogTitle>
        </DialogHeader>
        {entries.length === 0 ? (
          <p className="text-center py-8 text-amber-600">尚無紀錄，快來創造第一名！</p>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8 text-center">{MEDALS[i] ?? `${i + 1}.`}</span>
                    <div>
                      <p className="font-semibold text-amber-900">{entry.username}</p>
                      <p className="text-xs text-amber-500">{entry.date}</p>
                    </div>
                  </div>
                  <span className={`text-xl font-bold ${entry.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${entry.score}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full border-red-300 text-red-500 hover:bg-red-50"
              onClick={clearAll}
            >
              清除所有紀錄
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
