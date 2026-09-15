import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Unmounts whatever the previous test rendered before the next one starts -
// without this, component tests accumulate DOM across the whole file and
// queries like getByText start matching more than one element.
afterEach(cleanup);
