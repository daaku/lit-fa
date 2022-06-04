import { html, svg } from 'lit-html';

const joinCss = (obj, separator = ';') => {
  let texts;
  if (Array.isArray(obj)) {
    texts = obj.filter((text) => text);
  } else {
    texts = [];
    for (const prop in obj) {
      if (obj[prop]) {
        texts.push(`${prop}:${obj[prop]}`);
      }
    }
  }
  return texts.join(separator);
};

const getStyles = (style, size, pull, fw) => {
  let float;
  let width;
  const height = '1em';
  let lineHeight;
  let fontSize;
  let textAlign;
  let verticalAlign = '-.125em';
  const overflow = 'visible';

  if (fw) {
    textAlign = 'center';
    width = '1.25em';
  }

  if (pull) {
    float = pull;
  }

  if (size) {
    if (size == 'lg') {
      fontSize = '1.33333em';
      lineHeight = '.75em';
      verticalAlign = '-.225em';
    } else if (size == 'xs') {
      fontSize = '.75em';
    } else if (size == 'sm') {
      fontSize = '.875em';
    } else {
      fontSize = size.replace('x', 'em');
    }
  }

  return joinCss([
    joinCss({
      float,
      width,
      height,
      'line-height': lineHeight,
      'font-size': fontSize,
      'text-align': textAlign,
      'vertical-align': verticalAlign,
      'transform-origin': 'center',
      overflow,
    }),
    style,
  ]);
};

const getTransform = (
  scale,
  translateX,
  translateY,
  rotate,
  flip,
  translateTimes = 1,
  translateUnit = '',
  rotateUnit = '',
) => {
  let flipX = 1;
  let flipY = 1;

  if (flip) {
    if (flip == 'horizontal') {
      flipX = -1;
    } else if (flip == 'vertical') {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }

  return joinCss(
    [
      `translate(${parseFloat(translateX) * translateTimes}${translateUnit},${
        parseFloat(translateY) * translateTimes
      }${translateUnit})`,
      `scale(${flipX * parseFloat(scale)},${flipY * parseFloat(scale)})`,
      rotate && `rotate(${rotate}${rotateUnit})`,
    ],
    ' ',
  );
};

export const fa = ({
  icon,
  color,
  primaryColor,
  secondaryColor,
  swapOpacity = false,
  primaryOpacity = 1,
  secondaryOpacity = 0.4,
  style,
  size,
  pull,
  fw = false,
  scale = 1,
  translateX = 0,
  translateY = 0,
  flip = false,
  rotate,
}) => {
  const [width, height, , , pathData] = icon.icon;
  const styles = getStyles(style, size, pull, fw);
  const transform = getTransform(
    scale,
    translateX,
    translateY,
    rotate,
    flip,
    512,
  );
  let path;
  if (typeof pathData === 'string') {
    path = svg`
      <path
        d=${pathData}
        fill=${color || primaryColor || 'currentColor'}
        transform="translate(${width / -2} ${height / -2})"
      />`;
  } else {
    path = svg`
      <path
        d=${pathData[0]}
        fill=${secondaryColor || color || 'currentColor'}
        fill-opacity=${swapOpacity != false ? primaryOpacity : secondaryOpacity}
        transform="translate(${width / -2} ${height / -2})"
      />
      <path
        d=${pathData[1]}
        fill=${primaryColor || color || 'currentColor'}
        fill-opacity=${swapOpacity != false ? secondaryOpacity : primaryOpacity}
        transform="translate(${width / -2} ${height / -2})"
      />`;
  }
  const g = svg`
    <g
      transform="translate(${width / 2} ${height / 2})"
      transform-origin="${width / 4} 0"
    >
      <g transform=${transform}>${path}</g>
    </g>`;
  return html`<svg
    class="${icon.prefix}-${icon.iconName}"
    style=${styles}
    viewBox="0 0 ${width} ${height}"
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${g}
  </svg>`;
};
