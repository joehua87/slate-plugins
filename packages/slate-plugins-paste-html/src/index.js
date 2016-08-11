// @flow

import { Html } from 'slate'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */
 /**
  * Tags to blocks.
  *
  * @type {Object}
  */

const BLOCK_TAGS = {
  div: 'div',
  p: 'paragraph',
  li: 'list_item',
  ul: 'ul_list',
  ol: 'ol_list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  table: 'table',
  // thead: 'thead',
  // tbody: 'tbody',
  tr: 'table_row',
  td: 'table_cell',
}

 /**
  * Tags to marks.
  *
  * @type {Object}
  */

const MARK_TAGS = {
  b: 'bold',
  strong: 'bold',
  em: 'italic',
  i: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
}

const RULES = [
  // Logger
  {
    deserialize(el: CheerioElement) {
      console.log(el)
    },
  },
  // Handle default tags
  {
    deserialize(el: CheerioElement, next: Function) {
      if (!el.name) return undefined
      const block = BLOCK_TAGS[el.name]
      if (!block) return undefined
      return {
        kind: 'block',
        type: block,
        nodes: next(el.children),
      }
    },
  },
  // Handle img tag
  {
    deserialize(el: CheerioElement) {
      if (el.name !== 'img') return undefined
      return {
        kind: 'block',
        type: 'image',
        isVoid: true,
        data: {
          src: el.attribs.src,
        },
      }
    },
  },
  // Handle marks tag
  {
    deserialize(el: CheerioElement, next: Function) {
      if (!el.name) return undefined

      const mark = MARK_TAGS[el.name]
      if (!mark) return undefined
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.children),
      }
    },
  },
  {
    // Handle a tag
    deserialize(el: CheerioElement, next: Function): ?Object {
      if (el.name !== 'a') return undefined
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.children),
        data: {
          href: el.attribs.href,
        },
      }
    },
  },
  {
    // TODO Handle not use text
    deserialize(el: CheerioElement) {
      if (el.type !== 'text') return
      if (el.data.startsWith('\n')) {
        console.log(el.data)
        return
      }
    },
  }
]

const serializer = new Html({ rules: RULES })

export default function createPasteHtmlPlugin() {
  const onPaste = (e: any, data: any, state: State): ?State => {
    if (data.type !== 'html') return null
    const { document } = serializer.deserialize(data.html)

    return state
      .transform()
      .insertFragment(document)
      .apply()
  }

  return {
    onPaste,
  }
}
