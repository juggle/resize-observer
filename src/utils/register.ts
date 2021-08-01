import { scheduler } from './scheduler';
import { documentEvents, windowEvents } from './events';
import { isDocument } from './element';

/**
 * Global count of all observed elements.
 */
let observedElements = 0;

/**
 * Collection of known documents.
 * 
 * *Using WeakMap here as it's used elsewhere
 * and prevents loading WeakSet polyfill*.
 */
const documents = new WeakMap<Document | ShadowRoot>();

/**
 * Collection of known windows
 * 
 * *Using WeakMap here as it's used elsewhere
 * and prevents loading WeakSet polyfill*.
 */
const windows = new WeakMap<Window>();

/**
 * Default config for the global mutation observer.
 */
const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };

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
  if (root && root !== node) {
    return isDocument(root) ? root as Document | ShadowRoot : getDocument(root);
  }
  return null;
}

/**
 * Add a window to the list of known windows
 * @param window Window to add
 */
const addWindow = (window: Window) => {
  if (!windows.has(window)) {
    windows.set(window, 1);
    for (const event of windowEvents) {
      window.addEventListener(event, handleEvent, true);
    }
  }
}

/**
 * Adds a document to the list of known documents
 * @param document Document to add
 */
const addDocument = (document: Document | ShadowRoot) => {
  if (!documents.has(document)) {
    documents.set(document, 1);
    for (const event of documentEvents) {
      document.addEventListener(event, handleEvent, true);
    }
    mo.observe(document, observerConfig);
  }
}

/**
 * Observes interactions and mutations on root and ancestor documents.
 * This enables event handling in multiple scopes,
 * allowing consistent scheduling.
 * @param element Element being observed
 * @returns {void}
 */
const observeElementTree = (element: Element) => {
  let document = getDocument(element);
  let window = element.ownerDocument?.defaultView;
  while (window) {
    addWindow(window);
    addDocument(window.document);
    try {
      // Try to go up through the parent windows to improve detection of changes
      window = window === window.parent ? null : window.parent as typeof window;
    }
    catch {
      window = null;
    }
  }
  while (document) {
    addDocument(document);
    document = getDocument(document);
  }
}

/**
 * Registers the addition of a newly observed element.
 * @param element Element to register
 * @returns {void}
 */
const registerAddition = (element: Element) => {
  observeElementTree(element);
  observedElements++;
  handleEvent();
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
