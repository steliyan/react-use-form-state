import React from 'react';
import { renderWithFormState } from './test-utils';

const waitForNextTick = () => new Promise(resolve => setImmediate(resolve));

describe('useFormState options', () => {
  it('calls options.onChange when an input changes', async () => {
    const changeHandler = jest.fn();
    const { change } = renderWithFormState(
      ([, { text }]) => <input {...text('username')} />,
      null,
      { onChange: changeHandler },
    );
    change({ value: 'w' });
    expect(changeHandler).toHaveBeenCalledWith(
      expect.any(Object), // SyntheticEvent
      expect.objectContaining({ username: '' }),
      expect.objectContaining({ username: 'w' }),
      expect.any(Object), // setFieldError
    );
  });

  it('calls options.onChange with setFieldError', async () => {
    const changeHandler = jest.fn((_, __, ___, { setFieldError }) =>
      setFieldError('invalid username'),
    );
    const { formState, change } = renderWithFormState(
      ([, { text }]) => <input {...text('username')} />,
      null,
      { onChange: changeHandler },
    );
    change({ value: 'w' });

    await waitForNextTick();

    expect(formState.current.validity.username).toBeFalsy();
    expect(formState.current.errors.username).toEqual('invalid username');
  });

  it('calls options.onBlur when an input changes', () => {
    const blurHandler = jest.fn();
    const { blur } = renderWithFormState(
      ([, { text }]) => <input {...text('username')} />,
      null,
      { onBlur: blurHandler },
    );
    blur();
    expect(blurHandler).toHaveBeenCalledWith(expect.any(Object));
    blur();
    expect(blurHandler).toHaveBeenCalledTimes(2);
  });

  it('calls options.onTouched when an input changes', () => {
    const touchedHandler = jest.fn();
    const { blur } = renderWithFormState(
      ([, { text }]) => <input {...text('username')} />,
      null,
      { onTouched: touchedHandler },
    );
    blur();
    expect(touchedHandler).toHaveBeenCalled();
    blur();
    expect(touchedHandler).toHaveBeenCalledTimes(1);
  });
});
