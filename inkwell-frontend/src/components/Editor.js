import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import '../css/Editor.css';

const CustomButton = () => <span title="Insert Page Break">⏎</span>;

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

const Editor = ({ html, onChange, placeholder }) => {
  const modules = {
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

  const formats = [
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

  return (
    <div className="inkwell-upload-page-rich-editor">
      <CustomToolbar />
      <ReactQuill
        defaultValue={html}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        theme="snow"
        className="inkwell-upload-page-quill-editor"
      />
    </div>
  );
};

Editor.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  html: PropTypes.string
};

export default Editor;