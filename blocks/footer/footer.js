import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer metadata
  const footerMeta = getMetadata('footer');

  //  Check if metadata exists
  //console.log(`Footer metadata: ${footerMeta ? footerMeta : 'No metadata found'}`);

  //  the footer path
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  //  Check resolved footer path
  console.log(`Loading footer from: ${footerPath}`);

  // Load footer as fragment
  const fragment = await loadFragment(footerPath);

  if (!fragment) {
    console.error(`Failed to load footer fragment from: ${footerPath}`);
    return;
  }

  // Decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
