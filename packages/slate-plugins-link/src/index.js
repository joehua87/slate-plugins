// @flow

import React from 'react'

const NODES = {
  link: (props: { attributes: { [key: string]: any }, children: any, node: Node }) => {
    const { data } = props.node
    const href = data.get('href')
    return <a {...props.attributes} href={href}>{props.children}</a>
  },
}

export const hasLinks = (state: State) => state.inlines.some(inline => inline.type === 'link')

export const onLinkClick = (state: State): State => {
  const isHasLinks = hasLinks(state)

  let transformedState = state

  if (isHasLinks) {
    transformedState = transformedState
        .transform()
        .unwrapInline('link')
        .apply()
  } else if (transformedState.isExpanded) {
    const href = window.prompt('Enter the URL of the link:')
    transformedState = transformedState
      .transform()
      .wrapInline({
        type: 'link',
        data: { href },
      })
        .collapseToEnd()
        .apply()
  } else {
    const href = window.prompt('Enter the URL of the link:')
    const text = window.prompt('Enter the text for the link:')
    transformedState = transformedState
        .transform()
        .insertText(text)
        .extendBackward(text.length)
        .wrapInline({
          type: 'link',
          data: { href },
        })
        .collapseToEnd()
        .apply()
  }

  return transformedState
}

export default function () {
  const renderNode = (node: Node) => NODES[node.type]

  return {
    renderNode,
    test: () => console.log('test() from link-plugin'),
  }
}
