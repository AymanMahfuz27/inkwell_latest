import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import '../css/Editor.css';

const CustomButton = () => <span title="Insert Page Break">⊟</span>;

function insertPageBreak() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, '<!--pagebreak-->', 'user');
  this.quill.setSelection(cursorPosition + 16);
}

const CustomToolbar = () => (
  <div id="toolbar" className="inkwell-upload-page-rich-editor-toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <button className="ql-bold" title="Bold" />
    <button className="ql-italic" title="Italic" />
    <button className="ql-underline" title="Underline" />
    <button className="ql-strike" title="Strikethrough" />
    <button className="ql-insertPageBreak" title="Insert Page Break">
      <CustomButton />
    </button>
  </div>
);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
    if (this.props.onChange) {
      this.props.onChange(html);
    }
  }

  render() {
    return (
      <div className="inkwell-upload-page-rich-editor">
        <CustomToolbar />
        <ReactQuill
          onChange={this.handleChange}
          value={this.state.editorHtml}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
          theme={"snow"}
          className="inkwell-upload-page-quill-editor"
        />
      </div>
    );
  }
}

Editor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertPageBreak: insertPageBreak
    }
  },
  clipboard: {
    matchVisual: false,
  }
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color"
];

Editor.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default Editor;