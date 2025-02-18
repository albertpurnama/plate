import { traverseHtmlElements } from '@udecode/plate-common';
import { docxListToList } from './docxListToList';
import { isDocxList } from './isDocxList';

export const cleanDocxListElementsToList = (rootNode: Node): void => {
  traverseHtmlElements(rootNode, (element) => {
    const styleAttribute = element.getAttribute('style');

    if (styleAttribute) {
      element.setAttribute(
        'style',
        styleAttribute.replace(/mso-list:\s*Ignore/gim, 'mso-list:Ignore')
      );
    }

    return true;
  });

  traverseHtmlElements(rootNode, (element) => {
    if (!isDocxList(element)) {
      return true;
    }

    const { parentElement, previousSibling } = element;

    if (!parentElement) {
      return true;
    }

    const { list } = docxListToList(element);

    if (!list) {
      return true;
    }

    const beforeElement = previousSibling
      ? previousSibling.nextSibling
      : parentElement.firstChild;

    if (beforeElement) {
      parentElement.insertBefore(list, beforeElement);
    } else {
      parentElement.appendChild(list);
    }

    return false;
  });
};
