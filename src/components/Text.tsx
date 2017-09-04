import * as React from 'react';

import {DisplayEltType, MatchValidity} from '../typescript/commands';

import {get_indenting_whitespace} from '../typescript/text_tools';

function get_display_color(det: DisplayEltType) {
  switch (det) {
    case DisplayEltType.keyword:
      return 'aqua';
    case DisplayEltType.option:
      return 'orange';
    case DisplayEltType.filler:
      return 'ivory';
    case DisplayEltType.partial:
      return 'gray';
    case DisplayEltType.error:
      return 'red';
  }
}

export const ParsedText = (props) => {
  let {parser, children} = props;

  let style: any = {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
    position: 'relative'
  }
  let validity = parser.validity;
  if (validity === MatchValidity.valid) {
    style.fontWeight = '900';
    style.fontStyle = 'italic'
  } else {
    style.fontWeight = '100';
    if (validity === MatchValidity.invalid) {
      style.opacity = '0.6';
    }
  }

  const elt_style: any = {
    display: 'inline-block'
  }

  const span_style: any = {
    display: 'inline-block'
  }

  console.log('tail padding is');
  console.log(parser)
  return (
    <div style={style}>
      {(parser === undefined) ? '' : 
        parser.match.map((elt, i) => (
          <div key={i.toString()} style={{...elt_style, ...{color: get_display_color(elt.display)}}}>
            <span style={span_style}>
              {elt.match + ( i === parser.match.length - 1  ? parser.tail_padding : '' ) }
            </span>
            { ( i === parser.match.length - 1 ) ? children : '' }
          </div>
        ))
      }
    </div>
  );
}

export const OutputText = (props) => {
  const {message, style, ...rest} = props;
  const base_style = {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  }

  return (
    <div style={{...base_style, ...style}} {...rest}>
      {message !== undefined ? message : ''}
    </div>
  );
}