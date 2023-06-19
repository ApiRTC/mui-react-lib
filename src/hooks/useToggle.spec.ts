import { act, renderHook } from '@testing-library/react';

import useToggle from './useToggle';

describe('useToggle', () => {
    test(`toggle`, () => {
        const { result } = renderHook(() => useToggle(false));
        expect(result.current.value).toBe(false)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe(true)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe(false)
    })

    test(`re-render with different initial props shall update`, () => {
        const { result, rerender } = renderHook(useToggle, { initialProps: false });

        expect(result.current.value).toBe(false)

        rerender(true)

        expect(result.current.value).toBe(true)
    })
})