// @flow

import React from 'react'
import isImage from 'is-image'
import isUrl from 'is-url'
import { Data } from 'slate'

class Image extends React.Component {
  props: {
    node: Node,
    state: State,
    editor: Editor,
    attributes: any,
  };

  onSubmitChangeSrc = (e) => {
    e.preventDefault()

    const { state, node, editor } = this.props
    const isFocused = state.selection.hasEdgeIn(node)
    if (isFocused) e.stopPropagation()

    const nextState = state
      .transform()
      .moveToRangeOf(node)
      .setBlock({
        data: Data.create({
          src: 'https://pixabay.com/static/uploads/photo/2015/05/21/18/30/coffee-777612__340.jpg'
        }),
      })
      .apply()

    editor.onChange(nextState)
  }

  render() {
    const { node, state, attributes } = this.props
    // console.log('Image Props', props);
    const isFocused = state.selection.hasEdgeIn(node)
    const src = node.data.get('src')
    const caption = node.data.get('caption')
    const className = isFocused ? 'active' : null
    return (
      <img src={src} alt={caption} className={className} {...attributes} />
    )
    // return (
    //   <div>
    //     <img src={src} className={className} {...attributes} />
    //     <button onClick={this.onSubmitChangeSrc}>Edit Caption</button>
    //   </div>
    // );
  }
}

const NODES = {
  image: Image,
}

export const insertImage = (state: State, src: string): State => (
  state.transform()
    .insertBlock({
      type: 'image',
      isVoid: true,
      data: { src },
    })
    .apply()
)

export default function createImagePlugin() {
  const renderNode = (node: Node) => NODES[node.type]

  const onDocumentChange = (document: Document, state: State, editor: Editor) => {
    const blocks = document.getBlocks()
    const last = blocks.last()
    if (last.type !== 'image') return

    const normalized = state
      .transform()
      .collapseToEndOf(last)
      .splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {},
      })
      .apply({
        snapshot: false,
      })

    editor.onChange(normalized)
  }

  const onDropNode = (e: any, data: any, state: State): State => (
    state
      .transform()
      .removeNodeByKey(data.node.key)
      .moveTo(data.target)
      .insertBlock(data.node)
      .apply()
  )

  const onDropOrPasteFiles = (e: any, data: any, state: State, editor: Editor) => {
    for (const file of data.files) {
      const reader = new FileReader()
      const [type] = file.type.split('/')
      if (type !== 'image') continue // eslint-disable-line

      reader.addEventListener('load', () => { // eslint-disable-line
        state = editor.getState(); // eslint-disable-line
        state = insertImage(state, reader.result); // eslint-disable-line
        editor.onChange(state)
      })

      reader.readAsDataURL(file)
    }
  }

  const onDrop = (e: any, data: any, state: State, editor: Editor): ?State => {
    switch (data.type) {
      case 'files': return onDropOrPasteFiles(e, data, state, editor)
      case 'node': return onDropNode(e, data, state)
      default: return undefined
    }
  }

  /**
   * On paste text, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  const onPasteText = (e: any, data: any, state: State): ?State => {
    if (!isUrl(data.text)) return undefined
    if (!isImage(data.text)) return undefined
    return insertImage(state, data.text)
  }

  /**
   * On paste, if the pasted content is an image URL, insert it.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  const onPaste = (e: any, data: any, state: State, editor: Editor): ?State => {
    switch (data.type) {
      case 'files': return onDropOrPasteFiles(e, data, state, editor)
      case 'text': return onPasteText(e, data, state)
      default: return undefined
    }
  }

  return {
    renderNode,
    onDocumentChange,
    onDrop,
    onDropNode,
    onDropOrPasteFiles,
    onPaste,
    onPasteText,
  }
}
