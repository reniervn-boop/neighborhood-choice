/**
 * Annexure A to the Constitution — the area of jurisdiction.
 *
 * The boundary wording is clause 2.1 of the Constitution verbatim. The maps are
 * the Surveyor-General cadastral extracts supplied with the constitution pack
 * (Maps.docx), showing erf numbers and street names across the suburb.
 *
 * Note for whoever picks this up next: these are raster extracts, not geodata.
 * The prospectus map still wants a real SX7RA boundary GeoJSON — these images
 * are what you would trace it from.
 */

export interface JurisdictionMap {
  /** Path under /public */
  src: string;
  title: string;
  caption: string;
  width: number;
  height: number;
}

export interface BoundaryEdge {
  /** Clause number in the Constitution */
  ref: string;
  /** Short label, e.g. "North-western border" */
  label: string;
  text: string;
}

export const AREA_OF_JURISDICTION_INTRO =
  'The area of jurisdiction of the Association shall be the suburb of Sundowner ' +
  'Extension 7, within the City of Johannesburg Metropolitan Municipality. The ' +
  'area is bounded as follows:';

export const boundaryEdges: BoundaryEdge[] = [
  {
    ref: '2.1.1',
    label: 'North-western border',
    text:
      'Honeydew Road West from its intersection with Beyers Naudé Drive in the ' +
      'south-west to its intersection with Northumberland Avenue in the north-east. ' +
      'Properties on both sides of Honeydew Road West along this stretch are ' +
      'included — those on the inner (south-eastern) side facing into the suburb ' +
      'and those on the outer (north-western) side bordering Honeydew Road West ' +
      'from outside. The property on the northern side of Honeydew Road West at ' +
      'the Northumberland Avenue intersection, at the northern apex of the ' +
      'boundary, is also included.',
  },
  {
    ref: '2.1.2',
    label: 'North-eastern border',
    text:
      'The inner (south-western) edge of Northumberland Avenue from its ' +
      'intersection with Honeydew Road West in the north to its intersection with ' +
      'Beyers Naudé Drive in the south. Only properties on the inner side of ' +
      'Northumberland Avenue are included. Tourmaline Road and all streets between ' +
      'Honeydew Road West and Northumberland Avenue fall wholly within the ' +
      'boundary and are fully included.',
  },
  {
    ref: '2.1.3',
    label: 'Southern border',
    text:
      'The inner (northern) edge of Beyers Naudé Drive from its intersection with ' +
      'Northumberland Avenue in the east to its intersection with Honeydew Road ' +
      'West in the west. Only properties on the inner side of Beyers Naudé Drive ' +
      'are included.',
  },
  {
    ref: '2.1.4',
    label: 'South-western inclusion',
    text:
      'The property situated on the western side of Honeydew Road West between ' +
      'Boundary Road and the Beyers Naudé Drive intersection is specifically ' +
      'included within the boundary.',
  },
];

export const jurisdictionMaps: JurisdictionMap[] = [
  {
    src: '/maps/01-suburb-overview.png',
    title: 'Suburb overview',
    caption:
      'Sundowner Ext. 7 in context, with Honeydew Road West, Northumberland ' +
      'Avenue and the Beyers Naudé Drive interchange framing the suburb.',
    width: 562,
    height: 647,
  },
  {
    src: '/maps/02-northern-apex.png',
    title: 'Northern apex',
    caption:
      'Honeydew Road West meeting Northumberland Avenue — the northern point of ' +
      'the boundary described in clause 2.1.1.',
    width: 1081,
    height: 830,
  },
  {
    src: '/maps/03-north-eastern-section.png',
    title: 'North-eastern section',
    caption:
      'Calsium Crescent, Kalsedoon Street and Tourmaline Road, with erf numbers ' +
      'in the 500s and 570s.',
    width: 1352,
    height: 671,
  },
  {
    src: '/maps/04-central-section.png',
    title: 'Central section',
    caption:
      'Diamond Street, Kyanite Street and Garnet Street, running down to the ' +
      'Sundowner Ext. 26 and Ext. 39 boundary.',
    width: 1186,
    height: 610,
  },
  {
    src: '/maps/05-south-western-corner.png',
    title: 'South-western corner',
    caption:
      'Boundary Road and the Beyers Naudé Drive (K31) interchange, including the ' +
      'property specifically brought inside the boundary by clause 2.1.4.',
    width: 1126,
    height: 796,
  },
  {
    src: '/maps/06-north-western-approach.png',
    title: 'North-western approach',
    caption:
      'Quorn Drive and the agricultural holdings north-west of Honeydew Road ' +
      'West, outside the area of jurisdiction.',
    width: 1241,
    height: 807,
  },
];

export const NOT_AN_HOA_NOTICE =
  'For the avoidance of doubt, the Association is not a homeowners’ association, ' +
  'a body corporate, an estate, or a sectional title scheme. The Association has ' +
  'no authority over private property and does not levy compulsory contributions ' +
  'on property owners. Membership is voluntary.';
