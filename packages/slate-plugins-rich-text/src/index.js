// @flow

const MARKS = {
  bold: {
    fontWeight: 'bold',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: '3px',
    borderRadius: '4px',
  },
  italic: {
    fontStyle: 'italic',
  },
  underlined: {
    textDecoration: 'underline',
  },
}

export const hasMark = (type: string, state: State) => state.marks.some(mark => mark.type === type)

export const onClickMark = (type: string, state: State) => (
  state
    .transform()
    .toggleMark(type)
    .apply()
)

export default function () {
  const renderMark = (mark: Mark) => MARKS[mark.type]

  return {
    onClickMark,
    renderMark,
  }
}
