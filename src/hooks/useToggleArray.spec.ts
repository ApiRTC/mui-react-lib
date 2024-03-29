import { act, renderHook } from '@testing-library/react';

import useToggleArray from './useToggleArray';

describe('useToggleArray', () => {

    test(`Empty array value will be undefined`, () => {
        const { result } = renderHook(() => useToggleArray([]))
        expect(result.current.value).toBe(undefined)
        expect(result.current.index).toBe(-1)

        act(() => {
            result.current.toggle()
        })

        expect(result.current.value).toBe(undefined)
        expect(result.current.index).toBe(-1)
    })

    test(`Testing init index out of bounds`, () => {
        const { result } = renderHook(() => useToggleArray(['one', 'two'], -1))
        expect(result.current.value).toBe('one')
        expect(result.current.index).toBe(0)
    })

    test(`Testing init index out of bounds`, () => {
        const { result } = renderHook(() => useToggleArray(['one', 'two'], 5))
        expect(result.current.value).toBe('one')
        expect(result.current.index).toBe(0)
    })

    test(`Testing undefined array`, () => {
        const array = undefined;
        const { result } = renderHook(() => useToggleArray(array as any, 0))
        expect(result.current.value).toBe(undefined)
        expect(result.current.index).toBe(-1)
    })

    test(`Array of Strings toggle`, () => {
        const { result } = renderHook(() => useToggleArray<string>(['one', 'two', 'three']))
        expect(result.current.value).toBe('one')
        expect(result.current.index).toBe(0)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe('two')
        expect(result.current.index).toBe(1)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe('three')
        expect(result.current.index).toBe(2)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe('one')
        expect(result.current.index).toBe(0)
    })

    test(`Array of objects setIndex`, () => {
        const one = { key: 'one' };
        const two = { key: 'one' };

        const { result } = renderHook(() => useToggleArray<any>([one, two]))
        expect(result.current.value).toBe(one)
        expect(result.current.index).toBe(0)

        act(() => {
            result.current.setIndex(1)
        })
        expect(result.current.value).toBe(two)
        expect(result.current.index).toBe(1)
    })

    test(`re-render with different initial props`, () => {
        //const { result, rerender } = renderHook(useToggleArray, { initialProps: { values: ['1', '2'], initIndex: 0 } });
        const { result, rerender } = renderHook(useToggleArray, { initialProps: ['1', '2'] });
        expect(result.current.value).toBe('1')

        rerender()
        expect(result.current.value).toBe(undefined)

        rerender(['a', 'b'])
        expect(result.current.value).toBe('a')
    })

})