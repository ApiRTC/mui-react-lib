import { act, renderHook } from '@testing-library/react';

import useToggle from './useToggle';

describe('useToggle', () => {
    test(`toggle`, () => {
        const { result } = renderHook(() => useToggle(false))
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
})