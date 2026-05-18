import type { Test } from '../tests';
import { Vote } from './Vote';

type Props = {
  test: Test;
  onSelectVariant: (variantId: string) => void;
};

export const TestOverview: React.FC<Props> = ({ test, onSelectVariant }) => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header>
        <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">
          A/B Test
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{test.label}</h1>
      </header>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900">개요</h2>
        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {test.description}
        </p>
      </section>

      {test.testSteps && test.testSteps.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">테스트 방법</h2>
          <ol className="mt-2 space-y-2 text-sm text-gray-700 leading-relaxed list-decimal pl-5 marker:text-gray-400 marker:font-medium">
            {test.testSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900">시안 보기</h2>
        <div className="flex gap-2 mt-2 flex-wrap">
          {test.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVariant(v.id)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              {v.label} 보기 →
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Vote testId={test.id} variants={test.variants} />
      </section>
    </div>
  );
};
