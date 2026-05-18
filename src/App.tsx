import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TestOverview } from './components/TestOverview';
import { tests } from './tests';

type Selection = { testId: string; variantId: string | null };

function App() {
  const [selection, setSelection] = useState<Selection>({
    testId: 'sms-invite',
    variantId: null,
  });

  const activeTest = tests.find((t) => t.id === selection.testId);
  const activeVariant = activeTest?.variants.find(
    (v) => v.id === selection.variantId
  );
  const ActiveComponent = activeVariant?.component;

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <Sidebar tests={tests} selection={selection} onSelect={setSelection} />
      <main className="flex-1 h-screen overflow-auto">
        {ActiveComponent ? (
          <ActiveComponent />
        ) : activeTest ? (
          <TestOverview
            test={activeTest}
            onSelectVariant={(variantId) =>
              setSelection({ testId: activeTest.id, variantId })
            }
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            선택된 화면이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
