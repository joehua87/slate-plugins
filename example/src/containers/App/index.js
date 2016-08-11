// @flow

import { Editor, Raw } from 'slate'
import Portal from 'react-portal'
import React from 'react'
import position from 'selection-position'
import initialState from './state.json'
import styles from './styles.css'

import createLinkPlugin, { hasLinks, onLinkClick } from 'slate-plugins-link'
import createRichTextPlugin, { hasMark, onClickMark } from 'slate-plugins-rich-text'
import createImagePlugin, { insertImage } from 'slate-plugins-image'
import createPasteHtmlPlugin from 'slate-plugins-paste-html'
import createEditListPlugin from 'slate-edit-list'
import createEditTablePlugin from 'slate-edit-table'

const tablePlugin = createEditTablePlugin()

const plugins = [
  createLinkPlugin(),
  createRichTextPlugin(),
  createImagePlugin(),
  createPasteHtmlPlugin(),
  createEditListPlugin(),
  tablePlugin,
]

const ToolbarItem = ({ icon, isActive, onClick }: { icon: string, isActive: boolean, onClick: Function }) => (
  <span className="button" onMouseDown={onClick} data-active={isActive}>
    <span className="material-icons">{icon}</span>
  </span>
)

const NODES = {
  ul_list: (props: { attributes: { [key: string]: any }, children: any }) => (
    <ul {...props.attributes}>{props.children}</ul>
  ),
  ol_list: (props: { attributes: { [key: string]: any }, children: any }) => (
    <ol {...props.attributes}>{props.children}</ol>
  ),
  list_item: (props: { attributes: { [key: string]: any }, children: any }) => (
    <li {...props.attributes}>{props.children}</li>
  ),
  table: (props: { attributes: { [key: string]: any }, children: any }) => (
    <table>
      <tbody {...props.attributes}>{props.children}</tbody>
    </table>
  ),
  table_row: (props: { attributes: { [key: string]: any }, children: any }) => (
    <tr {...props.attributes}>{props.children}</tr>
  ),
  table_cell: (props: { attributes: { [key: string]: any }, children: any }) => (
    <td {...props.attributes}>{props.children}</td>
  ),
}

class SlateEditor extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true }),
  };

  state:{
    state: State,
    menu: any,
  }

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  onClickLink = (e:any) => {
    e.preventDefault()
    let { state } = this.state
    state = onLinkClick(state)
    this.setState({ state })
  }

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state:State) => {
    // const raw = Raw.serialize(state).document.nodes[4]
    // console.log('Run Editor\'s onChange', raw.data.src);
    this.setState({ state })
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (e:any, type:string) => {
    e.preventDefault()
    let { state } = this.state
    state = onClickMark(type, state)
    this.setState({ state })
  }

  /**
   * When the portal opens, cache the menu element.
   *
   * @param {Element} portal
   */

  onOpen = (portal:any) => {
    this.setState({ menu: portal.firstChild })
  }

  onClickImage = (e:any) => {
    e.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    let { state } = this.state
    state = insertImage(state.transform().wrapBlock({ type: 'table_cell' }).apply(), src)
    this.onChange(state)
  };

  onInsertTable = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.insertTable(state.transform())
        .apply()
    )
  };

  onInsertColumn = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.insertColumn(state.transform())
        .apply()
    )
  };

  onInsertRow = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.insertRow(state.transform())
        .apply()
    )
  };

  onRemoveColumn = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.removeColumn(state.transform())
        .apply()
    )
  };

  onRemoveRow = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.removeRow(state.transform())
        .apply()
    )
  };

  onRemoveTable = () => {
    const { state } = this.state

    this.onChange(
      tablePlugin.transforms.removeTable(state.transform())
        .apply()
    )
  };

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const { menu, state } = this.state
    if (!menu) return

    if (state.isBlurred || state.isCollapsed) {
      menu.removeAttribute('style')
      return
    }

    const rect = position()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + (window.scrollY - menu.offsetHeight)}px`
    menu.style.left = `${rect.left + (window.scrollX - (menu.offsetWidth / 2)) + (rect.width / 2)}px`
  };

  logState = () => {
    console.log(JSON.stringify(Raw.serialize(this.state.state), null, 2))
  };

  renderToolbar = () => {
    const isHasLinks = hasLinks(this.state.state)

    const isTable = tablePlugin.utils.isSelectionInTable(this.state.state)

    // TODO Refactor to use component
    return (
      <div>
        {isTable && this.renderTableToolbar()}
        <div className="menu toolbar-menu">
          <span className="button" onMouseDown={this.onClickLink} data-active={isHasLinks}>
            <span className="material-icons">link</span>
          </span>
          <span className="button" onMouseDown={this.onClickImage}>
            <span className="material-icons">image</span>
          </span>
          {!isTable && ( // Don't show table when table is focused
            <span className="button" onMouseDown={this.onInsertTable}>
              <span className="material-icons">grid_on</span>
            </span>
          )}
          <span className="button" onMouseDown={this.logState}>
            <span className="material-icons">print</span>
          </span>
        </div>
      </div>
    )
  };

  renderTableToolbar = () => (
    // TODO Refactor to use component
    <div>
      <button onClick={this.onInsertColumn}>Insert Column</button>
      <button onClick={this.onInsertRow}>Insert Row</button>
      <button onClick={this.onRemoveColumn}>Remove Column</button>
      <button onClick={this.onRemoveRow}>Remove Row</button>
      <button onClick={this.onRemoveTable}>Remove Table</button>
    </div>
  )

  renderNode = (node:Node) => NODES[node.type];

  renderMenu = () => {
    const marks = [
      {
        type: 'bold',
        icon: 'format_bold',
      },
      {
        type: 'italic',
        icon: 'format_italic',
      },
      {
        type: 'underlined',
        icon: 'format_underlined',
      },
      {
        type: 'code',
        icon: 'code',
      },
    ]

    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          {marks.map(({ type, icon }, idx) => (
            <ToolbarItem
              key={idx}
              icon={icon}
              isActive={hasMark(type, this.state.state)}
              onClick={(e) => this.onClickMark(e, type)}
            />
          ))}
          <ToolbarItem
            icon="link"
            isActive={hasLinks(this.state.state)}
            onClick={this.onClickLink}
          />
        </div>
      </Portal>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => (
    <div className="editor">
      <Editor
        state={this.state.state}
        plugins={plugins}
        renderNode={this.renderNode}
        onChange={this.onChange}
      />
    </div>
  );

  render() {
    return (
      <div className={styles.root}>
        {this.renderToolbar()}
        {this.renderMenu()}
        {this.renderEditor()}
      </div>
    )
  }
}

/**
 * Export.
 */

export default SlateEditor
