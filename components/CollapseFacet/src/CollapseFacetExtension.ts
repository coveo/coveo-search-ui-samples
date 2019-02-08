import {
    $$,
    Facet
} from "coveo-search-ui";

import "./CollapseFacetExtension.scss";

const toggleFacet = function (this: Facet) {
    if ($$(this.element).hasClass('coveo-facet-collapsed')) {
        this.expand();
    } else {
        this.collapse();
    }
};

const hookOnFacetCreation = (handler: () => void) => {
    const originalCreateDom = Coveo.Facet.prototype.createDom;
    Coveo.Facet.prototype.createDom = function (this: Facet) {
        originalCreateDom.call(this);
        handler.call(this);
    };
};

export function initializeCollapsibleFacets() {
    hookOnFacetCreation(function(this: Facet) {
        if (this.element.dataset.easyCollapsible === "true") {
            const facetElement = $$(this.element);
            facetElement.addClass("easy-collapse");
            const title = facetElement.findClass("coveo-facet-header")[0];
            $$(title).on("click", () => toggleFacet.call(this));

            if (this.element.dataset.autoCollapse === "true") {
                this.collapse();
            }
        }
    });
}
