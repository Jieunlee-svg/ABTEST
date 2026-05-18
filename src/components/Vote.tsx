import { useCallback, useEffect, useState } from 'react';
import type { Variant } from '../tests';
import { getVoterId, isSupabaseConfigured, supabase } from '../supabase';

type Props = {
  testId: string;
  variants: Variant[];
};

type VoteRow = { variant_id: string; voter_id: string };

export const Vote: React.FC<Props> = ({ testId, variants }) => {
  const [myVote, setMyVote] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);

  const fetchVotes = useCallback(async () => {
    if (!supabase) return;
    const voterId = getVoterId();
    const { data, error: fetchError } = await supabase
      .from('votes')
      .select('variant_id, voter_id')
      .eq('test_id', testId);

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    const next: Record<string, number> = {};
    let myCurrent: string | null = null;
    (data as VoteRow[] | null)?.forEach((row) => {
      next[row.variant_id] = (next[row.variant_id] || 0) + 1;
      if (row.voter_id === voterId) myCurrent = row.variant_id;
    });
    setCounts(next);
    setMyVote(myCurrent);
    setError(null);
  }, [testId]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    let active = true;

    (async () => {
      await fetchVotes();
      if (active) setLoading(false);
    })();

    const channel = client
      .channel(`votes:${testId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `test_id=eq.${testId}`,
        },
        () => {
          if (active) fetchVotes();
        }
      )
      .subscribe();

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [testId, fetchVotes]);

  const castVote = async (variantId: string) => {
    if (!supabase || voting) return;
    setVoting(true);
    setError(null);
    const voterId = getVoterId();

    const { error: upsertError } = await supabase.from('votes').upsert(
      {
        voter_id: voterId,
        test_id: testId,
        variant_id: variantId,
      },
      { onConflict: 'voter_id,test_id' }
    );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setMyVote(variantId);
      // realtime subscription will refresh counts; do an optimistic refetch too
      await fetchVotes();
    }
    setVoting(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <div className="text-sm font-semibold text-amber-900">
          ⚠️ Supabase 환경변수가 설정되지 않았어요
        </div>
        <div className="text-xs text-amber-800 mt-2 leading-relaxed">
          <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code>{' '}
          파일에 <code>VITE_SUPABASE_URL</code>,{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> 를 추가하고 dev 서버를 재시작해
          주세요. 배포 환경(Vercel)에도 같은 환경변수를 등록해야 합니다.
        </div>
      </div>
    );
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">투표</div>
          <div className="text-sm text-gray-600 mt-1">
            어느 안이 더 좋아 보이나요?
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      {error && (
        <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {variants.map((v) => {
          const isMine = myVote === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => castVote(v.id)}
              disabled={voting || loading}
              className={`flex-1 px-4 py-2 text-sm rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isMine
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              {v.label}
              {isMine && ' ✓'}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-2.5">
        {variants.map((v) => {
          const c = counts[v.id] || 0;
          const pct = total > 0 ? Math.round((c / total) * 100) : 0;
          return (
            <div key={v.id}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{v.label}</span>
                <span>
                  {c}표 ({pct}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="text-xs text-gray-500 pt-1">
          {loading ? '불러오는 중…' : `총 ${total}표`}
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-4 leading-relaxed">
        ※ 한 브라우저당 한 표. 다시 클릭하면 투표가 변경됩니다. 결과는 실시간
        반영돼요.
      </div>
    </div>
  );
};
