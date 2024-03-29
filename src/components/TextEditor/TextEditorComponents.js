import React from "react";
import styled, { css } from "styled-components";

export const EditorContainer = styled.div`
  background-color: #f6f4d0;
  padding: 0;
`;

export const TextArea = styled.div`
  resize: vertical;
  overflow: auto;
`;

export const Button = styled.span`
  cursor: pointer;
  color: black;
  cursor: pointer;
  color: black;
  ${props =>
    !props.active &&
    css`
      padding: 1px;
      border: 1px transparent rgba(255, 255, 255, 0.5);
    `};
  ${props =>
    props.active &&
    css`
      padding: 0px;
      border: 1px solid rgb(122, 121, 121);
      box-shadow: -1px 1px #ccc, -2px 2px #ccc, -3px 3px #ccc, -4px 4px #ccc;
    `};
`;

export const Icon = ({ className, ...rest }) => (
  <span className={`material-icons ${className}`} {...rest} />
);

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 5px;
  border-bottom: 2px solid #eee;
`;

export const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`;