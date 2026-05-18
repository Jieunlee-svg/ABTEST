import { useState } from 'react';
import type { Test } from '../tests';

type Selection = { testId: string; variantId: string | null };

type SidebarProps = {
  tests: Test[];
  selection: Selection;
  onSelect: (selection: Selection) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  tests,
  selection,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tests.map((t) => [t.id, true]))
  );

  const toggleExpand = (testId: string) => {
    setExpanded((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  return (
    <aside className="w-60 shrink-0 h-screen border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-900">A/B Test</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {tests.map((test) => {
          const isOpen = expanded[test.id];
          const isOverviewActive =
            selection.testId === test.id && selection.variantId === null;
          return (
            <div key={test.id} className="mb-1">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    onSelect({ testId: test.id, variantId: null });
                    setExpanded((prev) => ({ ...prev, [test.id]: true }));
                  }}
                  className={`flex-1 text-left px-4 py-2 text-sm font-medium ${
                    isOverviewActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {test.label}
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpand(test.id)}
                  aria-label={isOpen ? '접기' : '펼치기'}
                  className="px-2 py-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  <span
                    className={`inline-block transition-transform ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>
                </button>
              </div>

              {isOpen && (
                <ul className="pl-8 py-1">
                  {test.variants.map((variant) => {
                    const active =
                      selection.testId === test.id &&
                      selection.variantId === variant.id;
                    return (
                      <li key={variant.id}>
                        <button
                          type="button"
                          onClick={() =>
                            onSelect({
                              testId: test.id,
                              variantId: variant.id,
                            })
                          }
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${
                            active
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {variant.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
