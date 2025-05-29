// INFO: We import this so vite processes the stylesheet
import "./site.css";

import { FilterPill } from "./filter-pill.js";
import { FilterList } from "./filter-list.js";
import { ScrollButton } from "./scroll-button.js";
import { ToolTip } from "./tool-tip.js";
import { PopupImage } from "./popup-image.js";
import { TabList } from "./tab-list.js";
import { AbbreviationTooltips } from "./abbrev-tooltips.js";
import { IntLink } from "./int-link.js";
import { ImageReel } from "./image-reel.js";
import { MultiSelectRole } from "./multi-select-role.js";
import { MultiSelectSimple } from "./multi-select-simple.js";

const FILTER_LIST_ELEMENT = "filter-list";
const SCROLL_BUTTON_ELEMENT = "scroll-button";
const TOOLTIP_ELEMENT = "tool-tip";
const ABBREV_TOOLTIPS_ELEMENT = "abbrev-tooltips";
const INT_LINK_ELEMENT = "int-link";
const POPUP_IMAGE_ELEMENT = "popup-image";
const TABLIST_ELEMENT = "tab-list";
const FILTER_PILL_ELEMENT = "filter-pill";
const IMAGE_REEL_ELEMENT = "image-reel";
const MULTI_SELECT_ROLE_ELEMENT = "multi-select-places";
const MULTI_SELECT_SIMPLE_ELEMENT = "multi-select-simple";

customElements.define(INT_LINK_ELEMENT, IntLink);
customElements.define(ABBREV_TOOLTIPS_ELEMENT, AbbreviationTooltips);
customElements.define(FILTER_LIST_ELEMENT, FilterList);
customElements.define(SCROLL_BUTTON_ELEMENT, ScrollButton);
customElements.define(TOOLTIP_ELEMENT, ToolTip);
customElements.define(POPUP_IMAGE_ELEMENT, PopupImage);
customElements.define(TABLIST_ELEMENT, TabList);
customElements.define(FILTER_PILL_ELEMENT, FilterPill);
customElements.define(IMAGE_REEL_ELEMENT, ImageReel);
customElements.define(MULTI_SELECT_ROLE_ELEMENT, MultiSelectRole);
customElements.define(MULTI_SELECT_SIMPLE_ELEMENT, MultiSelectSimple);

export { FilterList, ScrollButton, AbbreviationTooltips };
