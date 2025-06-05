import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// @ts-ignore
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
