import React from "react";
import { Block, Value } from "slate";
import { Editor, getEventRange } from "slate-react";
import { isKeyHotkey } from "is-hotkey";
import {
  TextArea,
  EditorContainer,
  Button,
  Icon,
  Toolbar,
  Image
} from "./TextEditorComponents";
import "./TextEditor.css";
import Plain from "slate-plain-serializer";
import Html from "slate-html-serializer";
import { uploadToStorage } from "../../scripts/FirebaseUtilities";
import { Progress } from "reactstrap";

/**
 * Deserialize == convert DOM to Slate model
 * Serialize == convert Slate model to DOM
 *
 * @type {Object}
 */
const rules = [
  {
    deserialize(el, next) {
      const BLOCK_TAGS = {
        blockquote: "blockquote",
        p: "paragraph",
        pre: "code",
        h1: "heading-one",
        h2: "heading-two",
        ol: "numbered-list",
        ul: "bulleted-list",
        li: "list-item",
        a: "link",
        img: "image"
      };
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        if (type === "link") {
          var obj = {
            object: "inline",
            type: type,
            data: { href: el.getAttribute("href") },
            nodes: next(el.childNodes)
          };
          return obj;
        } else if (type === "image") {
          return {
            object: "block",
            type: type,
            data: { src: el.getAttribute("src") }
          };
        } else {
          return {
            object: "block",
            type: type,
            data: { className: el.getAttribute("class") },
            nodes: next(el.childNodes)
          };
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === "inline") {
        if (obj.type === "link") {
          //this is what gets stored in firebase
          return <a href={obj.toJSON().data.href}>{children}</a>;
        }
      }
      if (obj.object === "block") {
        switch (obj.type) {
          case "code":
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case "paragraph":
            return <p className={obj.data.get("className")}>{children}</p>;
          case "blockquote":
            return <blockquote>{children}</blockquote>;
          case "heading-one":
            return <h1>{children}</h1>;
          case "heading-two":
            return <h2>{children}</h2>;
          case "numbered-list":
            return <ol>{children}</ol>;
          case "bulleted-list":
            return <ul>{children}</ul>;
          case "list-item":
            return <li>{children}</li>;
          case "image":
            return (
              <img
                src={obj.toJSON().data.src}
                alt=""
                style={{
                  flex: 1,
                  maxWidth: "800px",
                  maxHeight: "800px",
                  width: "auto",
                  height: "auto"
                }}
              />
            );
          default:
            console.error(
              "serialize block on default case. obj.type=",
              obj.type
            );
        }
      }
    }
  },
  {
    deserialize(el, next) {
      const MARK_TAGS = {
        em: "italic",
        strong: "bold",
        u: "underlined"
      };
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "mark",
          type: type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <em>{children}</em>;
          case "underlined":
            return <u>{children}</u>;
          default:
            console.error(
              "serialize mark on default case. obj.type=",
              obj.type
            );
        }
      }
    }
  }
];

/**
 * Create a new serializer instance with our 'rules'
 *  @type {Html}
 */
const html = new Html({ rules });

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
 * @param {String} href
 */
const wrapLink = (editor, href) => {
  editor.wrapInline({
    type: "link",
    data: { href }
  });

  editor.moveToEnd();
};

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */
const unwrapLink = editor => {
  editor.unwrapInline("link");
};

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */
const insertImageUrl = (editor, src, target) => {
  if (target) {
    editor.select(target);
  }
  editor.insertBlock({
    type: "image",
    data: { src: src }
  });
};

/**
 * The editor's schema.
 *
 * @type {Object}
 */
const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case "last_child_type_invalid": {
          const paragraph = Block.create("paragraph");
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
        default:
          console.error("Default case in TextEditor > schema");
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

class TextEditor extends React.Component {
  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */
  ref = editor => {
    this.editor = editor;
  };

  /**
   * State: serialize the initial editor value.
   * @type {Object}
   */
  state = {
    post_key: "",
    value: Value.fromJSON(html.deserialize("")),
    plainText: "",
    valueHtml: "",
    uploadProgress: 100
  };

  /**
   * Set state from props
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const value = Value.fromJSON(html.deserialize(nextProps.initialRichText));
    const plainText = Plain.serialize(value);
    const valueHtml = nextProps.initialRichText;
    this.setState({ ...this.state, post_key: nextProps.post_key, value, plainText, valueHtml });
  }

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */
  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === "link");
  };

  _handleIconClick = () => {
    var inputField = this.refs.fileField;
    inputField.click();
  };

  /**
   * Render the app.
   *
   * @return {Element} element
   */
  render() {
    let {uploadProgress, value} = this.state;
    return (
      <div className="textEditor">
        <EditorContainer>
          <Toolbar>
            {this.renderMarkButton("bold", "format_bold")}
            {this.renderMarkButton("italic", "format_italic")}
            {this.renderMarkButton("underlined", "format_underlined")}
            {this.renderBlockButton("code", "code")}
            {this.renderBlockButton("heading-one", "looks_one")}
            {this.renderBlockButton("heading-two", "looks_two")}
            {this.renderBlockButton("blockquote", "format_quote")}
            {this.renderBlockButton("numbered-list", "format_list_numbered")}
            {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
            {/* Insert link */}
            {/* <Button
              isActive={this.hasLinks()}
              onMouseDown={event => this.onClickLink(event, "looks_two")}
            >
              <Icon title="insert_link">insert_link</Icon>
            </Button> */}
            {/* Insert image URL */}
            {/* <Button onMouseDown={this.onClickImageUrl}>
              <Icon title="Insert image url">image</Icon>
            </Button> */}
            {/* Upload image */}
            {/* <div className="element">
              <Icon
                title="Cloud upload"
                onClick={this._handleIconClick}
                style={{ cursor: "pointer" }}
              >
                cloud_upload
              </Icon>
              <input
                ref="fileField"
                type="file"
                id="upload"
                name="upload"
                accept="image/png, image/jpeg"
                multiple=""
                style={{ display: "none", width: "auto", height: "auto" }}
                onChange={event => this.onChangeInput(event)}
              />
            </div> */}
            {/* Progress bar of Upload image */}
            {/* {uploadProgress < 100 && (
              <Progress
                animated
                value={uploadProgress}
                color="info"
                max={100}
                style={{ width: "200px" }}
              >
                {uploadProgress.toFixed(0)}
              </Progress>
            )} */}
          </Toolbar>
          <TextArea>
            <Editor
              spellCheck
              autoFocus
              placeholder=""
              style={{
                height: this.props.height ? this.props.height : "25em"
              }}
              ref={this.ref}
              value={value}
              schema={schema}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderMark={this.renderMark}
              renderBlock={this.renderBlock}
            />
          </TextArea>
        </EditorContainer>
        <div className="resizable grippie bbr-sm mr-0" />
      </div>
    );
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */
  onChange = ({ value }) => {
    const plainText = Plain.serialize(value);
    
    // Set state
    var valueHtml = html.serialize(Value.fromJSON(value));
    this.setState({ ...this.state, value, plainText, valueHtml });
  };

  /**
   * On key down, if it is a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */
  onKeyDown = (event, editor, next) => {
    let mark;
    const isBoldHotkey = isKeyHotkey("mod+b");
    const isItalicHotkey = isKeyHotkey("mod+i");
    const isUnderlinedHotkey = isKeyHotkey("mod+u");
    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else {
      return next();
    }
    event.preventDefault();
    editor.toggleMark(mark);
  };

  /**
   * Callback firing after a user has selected a file using the input element
   *
   * @param {Object} event
   */
  onChangeInput(event) {
    event.preventDefault();
    const { editor } = this;
    const target = getEventRange(event, editor);
    this.handleFileUpload(editor, target, event.target.files);
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */
  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  /**
   * Deserialize: Render a Slate node/block.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */
  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "code":
        return <code {...attributes}>{children}</code>;
      case "blockquote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "link":
        const { isFocused } = props;
        const { data } = node;
        const href = data.get("href");
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      case "image": {
        const src = node.data.get("src");
        return <Image src={src} selected={isFocused} {...attributes} />;
      }
      default:
        return next();
    }
  };

  /**
   * Render (return HTML for icons) a block-toggling toolbar button
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);
    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;
      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }
    return (
      <Button
        isActive={isActive}
        onMouseDown={event => this.onClickBlockBtn(event, type)}
      >
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render (return HTML for icons) a mark-toggling toolbar button
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <Button
        isActive={isActive}
        onMouseDown={event => this.onClickMarkBtn(event, type)}
      >
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   * Callback for renderMarkButton
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickMarkBtn = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickLink = (event, type) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const hasLinks = this.hasLinks();
    if (hasLinks) {
      editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      const href = window.prompt("Enter the URL of the link:");
      if (href == null) {
        return;
      }
      editor.command(wrapLink, href);
    } else {
      const href = window.prompt("Enter the URL of the link:");
      if (href == null) {
        return;
      }
      const text = window.prompt("Enter the text for the link:", "My link");
      if (text == null) {
        return;
      }
      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command(wrapLink, href);
    }
  };

  /**
   * When a block button is clicked, toggle the block type.
   * Callback for renderBlockButton
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickBlockBtn = (event, type) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const { document } = value;
    const DEFAULT_NODE = "paragraph";
    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");
      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });
      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };

  /**
   * On clicking the "insert image url" button, prompt for an image and insert it
   *
   * @param {Event} event
   */
  onClickImageUrl = event => {
    event.preventDefault();
    const src = window.prompt("Enter the URL of the image:");
    if (!src) return;
    this.editor.command(insertImageUrl, src);
  };

  handleFileUpload = (editor, target, files) => {
    for (const file of files) {
      const reader = new FileReader();
      const [mime] = file.type.split("/");
      if (mime !== "image") continue;
      //Callback to update the progress bar during the upload
      const onUploadProgress = uploadProgress => {
        this.setState({ ...this.state, uploadProgress });
      };
      //Callback to insert block in Slate model with src, the image's location in firebase
      const onSuccessfulUpload = src => {
        editor.insertBlock({
          type: "image",
          data: { src }
        });
      };
      const onError = (msg, error) => {
        alert(msg);
        console.error(error);
      };
      reader.addEventListener("load", () => {
        if (target) {
          editor.select(target);
        }
        //This saves image in <img> element, which becomes big (too many chars) for firebase
        //editor.command(this.insertImageUrl, reader.result, target);
        // Save file to cloud storage (e.g. firebase)
        editor.command(
          this.insertImage2Storage,
          file,
          onUploadProgress,
          onSuccessfulUpload,
          onError
        );
      });
      reader.readAsDataURL(file);
    }
    return;
  };

  /**
   * Upload a file to firebase storage.
   *
   * @param {Editor} editor - Slate's Editor
   * @param {File} file - The File object to be uploaded
   * @callback [onUploadProgress] - Callback on upload progress triggering when the file is being uploading.
   * @callback [onSuccessfulUpload] - Callback triggering when the file is successfully uploaded
   * @callback [onError] - Callback on error message and object triggering when the upload encounters an error
   */
  insertImage2Storage = (
    editor,
    file,
    onUploadProgress = undefined,
    onSuccessfulUpload = undefined,
    onError = undefined
  ) => {
    var metadata = {
      contentType: file.type,
      customMetadata: { status: "draft" }
    };
    // Upload to Storage passing callbacks. Note that unregister is called in function on complete or on error
    uploadToStorage(
      this.state.post_key,
      file,
      metadata,
      onUploadProgress,
      onSuccessfulUpload,
      onError
    );
  };
}

export default TextEditor;