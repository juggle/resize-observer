import { scheduler } from "./scheduler";
import { documentEvents } from './events';

/**
 * Global count of all observed elements.
 */
let observedElements = 0;

/**
 * Event state of the Document or Shadow Root.
 * This determines if the document is know and if
 * any event listeners have been attached.
 */
const eventState = new WeakMap<DocumentOrShadowRoot, boolean>();

/**
 * Default config for the global mutation observer.
 */
const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };

/**
 * Checks to see if the root element is known
 * and if event listeners are active.
 * @param root root element to test
 */
const isActive = (root: DocumentOrShadowRoot) => eventState.get(root) === true;

/**
 * Global event handler for all document events.
 */
const handleEvent = () => observedElements && scheduler.schedule();

/**
 * Global mutation observer for all documents.
 */
const mo = new MutationObserver(handleEvent);

/**
 * Gets the document or shadow root of a node.
 * @param node Node of which to get the document of.
 * @returns the Document or Shadow Root
 */
const getDocument = (node: Node): Document | ShadowRoot | null => {
  const root = node.getRootNode ? node.getRootNode({ composed: node.nodeType === 11 }) : node.ownerDocument;
  if (root && root !== node && !(/9|11/).test(root.nodeType.toString())) {
    return getDocument(root);
  }
  return root as Document | ShadowRoot | null;
}

/**
 * Attaches event listeners to root node
 * @param root Root node to attach event listeners to
 * @returns {void}
 */
const attachListeners = (root: Document | ShadowRoot): void => {
  for (const event of documentEvents) {
    root.addEventListener(event, handleEvent);
  }
  mo.observe(root, observerConfig);
  eventState.set(root, true);
}

/**
 * Observes interactions on the root of the provides node.
 * @param node Node of which root to observe
 * @returns {void}
 */
const observeNodeRoot = (node: Node) => {
  const root = getDocument(node);
  if (root && !isActive(root)) {
    attachListeners(root);
    const next = getDocument(root);
    next && next !== root && observeNodeRoot(root);
  }
}

/**
 * Registers the addition of a newly observed element.
 * @param element Element to register
 * @returns {void}
 */
const registerAddition = (element: Element) => {
  observeNodeRoot(element);
  observedElements++;
}

/**
 * Registers the removal of a newly unobserved element.
 * @param element Element to register
 * @returns {void}
 */
const registerRemoval = (element: Element) => {
  element; // Do nothing with the element for now
  observedElements--;
}

export { registerAddition, registerRemoval }
