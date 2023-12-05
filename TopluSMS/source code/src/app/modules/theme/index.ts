import {Theme} from 'react-select'

export const selectTheme = (theme: Theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary: 'var(--bs-gray-400)', // select border active /ok
    primary50: 'var(--bs-gray-600)', // option active / ok
    primary25: 'var(--bs-gray-200)', // option hover, selected / ok
    neutral0: 'var(--bs-body-bg)', // main bg // ok
    neutral20: 'var(--bs-gray-300);', //border / ok
    neutral30: 'var(--bs-gray-300)', // ok
    neutral40: 'var(--bs-gray-300);', //hover border ok
    neutral50: 'var(--bs-gray-600)', // default text
    neutral60: 'var(--bs-text-gray-700)', // down
    neutral80: 'var(--bs-gray-800)', // selected text
  },
})
