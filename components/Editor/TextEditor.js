import React, { useState, useRef } from "react";
import { Editor, Block, Value } from "slate";
import { getEventRange } from "slate-react";
import InsertImages from "slate-drop-or-paste-images";
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
 * @type { Object }
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
          // This is what gets stored in Firebase
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
 * 
 * @type { Html }
 */
const html = new Html({ rules });

/**
 * A change helper to standardize wrapping links.
 *
 * @param { Editor } editor
 * @param { String } href
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
 * @param { Editor } editor
 */
const unwrapLink = editor => {
  editor.unwrapInline("link");
};

/**
 * Adds the plugin to your set of plugins.
 */
const plugins = [
  InsertImages({
    extensions: ["png", "jpg"],
    insertImage: (change, file) => {
      return change.insertBlock({
        type: "image",
        isVoid: true,
        data: { file }
      });
    }
  })
];

/**
 * A change function to standardize inserting images.
 *
 * @param { Editor } editor
 * @param { String } src
 * @param { Range } target
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
 * @type { Object }
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

const TextEditor = (props) => {
  const val = Value.fromJSON(html.deserialize(""));

  const [editor, setEditor] = useState(null);
  const [postKey, setPostKey] = useState("");
  const [value, setValue] = useState(val);
  const [plainText, setPlainText] = useState("");
  const [valueHtml, setValueHtml] = useState("");
  const [uploadProgress, setUploadProgress] = useState(100);
  const inputRef = useRef(null);

  /**
   * Store a reference to the `editor`.
   *
   * @param { Editor } editor
   */
  const editorRef = editor => {
    setEditor(editor);
  };

  /**
   * Sets state from props.
   * 
   * @param {*} nextProps
   */
  const componentWillReceiveProps = nextProps => {
    setValue(Value.fromJSON(html.deserialize(nextProps.initialRichText)));
    setPlainText(Plain.serialize(value));
    setValueHtml(nextProps.initialRichText);
    setPostKey(nextProps.postKey);
  };

  /**
   * Checks whether the current selection has a link in it.
   *
   * @return { Boolean }
   */
  const hasLinks = () => {
    return value.inlines.some(inline => inline.type === "link");
  };

  const _handleIconClick = () => {
    inputRef.current.click();
  };

  /**
   * On change, saves the new `value`.
   *
   * @param { Editor } editor
   */
  const onChange = ({ value }) => {
    const plainText = Plain.serialize(value);

    // Set state
    var valueHtml = html.serialize(Value.fromJSON(value));

    setValue(value);
    setPlainText(plainText);
    setValueHtml(valueHtml);
  };

  /**
   * On key down, if it is a formatting command toggles a mark.
   *
   * @param { Event } event
   * @param { Editor } editor
   * @return { Change }
   */
  const onKeyDown = (event, editor, next) => {
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
   * Callback firing after a user has selected a file using the input element.
   *
   * @param { Event } event
   */
  const onChangeInput = (event) => {
    event.preventDefault();
    const target = getEventRange(event, editor);
    handleFileUpload(editor, target, event.target.files);
  }

  /**
   * Renders a Slate mark.
   *
   * @param { Object } props
   * @param { Editor } editor
   * @param { Function } next
   * @return { Element }
   */
  const renderMark = (props, editor, next) => {
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
   * Deserialize: Renders a Slate node/block.
   *
   * @param { Object } props
   * @param { Editor } editor
   * @param { Function } next
   * @return { Element }
   */
  const renderBlock = (props, editor, next) => {
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
   * Renders (return HTML for icons) a block-toggling toolbar button.
   *
   * @param { String } type
   * @param { String } icon
   * @return { Element }
   */
  const renderBlockButton = (type, icon) => {
    let isActive = hasBlock(type);
    if (["numbered-list", "bulleted-list"].includes(type)) {
      const { document, blocks } = value;
      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        isActive={isActive}
        onMouseDown={event => onClickBlockBtn(event, type)}
      >
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Renders (return HTML for icons) a mark-toggling toolbar button.
   *
   * @param { String } type
   * @param { String } icon
   * @return { Element }
   */
  const renderMarkButton = (type, icon) => {
    const isActive = hasMark(type);

    return (
      <Button
        isActive={isActive}
        onMouseDown={event => onClickMarkBtn(event, type)}
      >
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Checks if the current selection has a mark with `type` in it.
   *
   * @param { String } type
   * @return { Boolean }
   */
  const hasMark = type => {
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Checks if the any of the currently selected blocks are of `type`.
   *
   * @param { String } type
   * @return { Boolean }
   */
  const hasBlock = type => {
    return value.blocks.some(node => node.type === type);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   * Callback for renderMarkButton
   *
   * @param { Event } event
   * @param { String } type
   */
  const onClickMarkBtn = (event, type) => {
    event.preventDefault();
    editor.toggleMark(type);
  };

  /**
   * When clicking a link, if the selection has a link in it, removes the link.
   * Otherwise, adds a new link with an href and text.
   *
   * @param { Event } event
   * @param { String } type
   */
  const onClickLink = (event, type) => {
    event.preventDefault();
    const hasLinks = hasLinks();
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
   * @param { Event } event
   * @param { String } type
   */
  const onClickBlockBtn = (event, type) => {
    event.preventDefault();
    const { document } = value;
    const DEFAULT_NODE = "paragraph";
    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = hasBlock(type);
      const isList = hasBlock("list-item");
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
      const isList = hasBlock("list-item");
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
   * @param { Event } event
   */
  const onClickImageUrl = event => {
    event.preventDefault();
    const src = window.prompt("Enter the URL of the image:");
    if (!src) return;
    editor.command(insertImageUrl, src);
  };

  /**
   * Handles a file upload.
   * 
   * @param { Editor } editor
   * @param { Range } target
   * @param { File[] } files
   */
  const handleFileUpload = (editor, target, files) => {
    for (const file of files) {
      const reader = new FileReader();
      const [mime] = file.type.split("/");
      if (mime !== "image") continue;

      // Callback to update the progress bar during the upload
      const onUploadProgress = uploadProgress => {
        setUploadProgress(uploadProgress);
      };

      // Callback to insert block in Slate model with src, the image's location in firebase
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

        // Saves file to cloud storage.
        editor.command(
          insertImage2Storage,
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
   * @param { Editor } editor - Slate's Editor
   * @param { File } file - The File object to be uploaded
   * @callback [onUploadProgress] - Callback on upload progress triggering when the file is being uploading.
   * @callback [onSuccessfulUpload] - Callback triggering when the file is successfully uploaded
   * @callback [onError] - Callback on error message and object triggering when the upload encounters an error
   */
  const insertImage2Storage = (
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
      postKey,
      file,
      metadata,
      onUploadProgress,
      onSuccessfulUpload,
      onError
    );
  };

  return (
    <div className="textEditor">
      <EditorContainer>
        <Toolbar>
          {renderMarkButton("bold", "format_bold")}
          {renderMarkButton("italic", "format_italic")}
          {renderMarkButton("underlined", "format_underlined")}
          {renderBlockButton("code", "code")}
          {renderBlockButton("heading-one", "looks_one")}
          {renderBlockButton("heading-two", "looks_two")}
          {renderBlockButton("blockquote", "format_quote")}
          {renderBlockButton("numbered-list", "format_list_numbered")}
          {renderBlockButton("bulleted-list", "format_list_bulleted")}
          {/* Insert link */}
          <Button
            active={hasLinks()}
            onMouseDown={event => onClickLink(event, "looks_two")}
          >
            <Icon title="insert_link">insert_link</Icon>
          </Button>
          {/* Insert image URL */}
          <Button onMouseDown={onClickImageUrl}>
            <Icon title="Insert image url">image</Icon>
          </Button>
          {/* Upload image */}
          <div className="element">
            <Icon
              title="Insert image url"
              onClick={_handleIconClick}
              style={{ cursor: "pointer" }}
            >
              cloud_upload
            </Icon>
            <input
              ref={inputRef}
              type="file"
              id="upload"
              name="upload"
              accept="image/png, image/jpeg"
              multiple=""
              style={{ display: "none", width: "auto", height: "auto" }}
              onChange={event => onChangeInput(event)}
            />
          </div>
          {/* Progress bar of Upload image */}
          {uploadProgress < 100 && (
            <Progress
              animated
              value={uploadProgress}
              color="info"
              max={100}
              style={{ width: "200px" }}
            >
              {uploadProgress.toFixed(0)}
            </Progress>
          )}
        </Toolbar>
        <TextArea>
          <Editor
            spellCheck
            autoFocus
            placeholder=""
            style={{
              height: props.height ? props.height : "25em"
            }}
            ref={editorRef}
            value={value}
            plugins={plugins}
            schema={schema}
            onChange={onChange}
            onKeyDown={onKeyDown}
            renderMark={renderMark}
            renderNode={renderBlock}
          />
        </TextArea>
      </EditorContainer>
      <div className="resizable grippie bbr-sm mr-0" />
    </div>
  );
};
export default TextEditor;