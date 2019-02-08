import {
  Component,
  ComponentOptions,
  IFieldOption,
  IComponentBindings,
  $$,
  QueryEvents,
  IDoneBuildingQueryEventArgs,
  IQuerySuccessEventArgs,
  IIndexFieldValue,
  Initialization,
  Assert,
  IGroupByRequest,
  InitializationEvents
} from 'coveo-search-ui';

import "./TemplatedFacet.scss";

export type ITemplatedFacetValidSortCriteria = 'score' | 'alphaascending' | 'alphadescending' | 'chisquare' | 'nosort';

export interface ITemplatedFacetOptions {
  field: IFieldOption;
  template: HTMLElement;
  resultContainer: HTMLElement;
  maximumNumberOfValues: number;
  sortCriteria: ITemplatedFacetValidSortCriteria;
  queryOverride: string;
  updateOnNewQuery: boolean;
}

export class TemplatedFacet extends Component {
  static ID = 'TemplatedFacet';

  static options: ITemplatedFacetOptions = {
    /**
     * The name of the field to fetch values for.
     * Required.
     */
    field: ComponentOptions.buildFieldOption({
      required: true
    }),
    /**
     * The selector of the template to use. Must be an underscore template script tag.
     * By default, will select the first children of the component element.
     */
    template: ComponentOptions.buildSelectorOption({
      defaultFunction: (element: HTMLElement) => <HTMLElement>element.firstChild
    }),
    /**
     * The container in which to place the resulting template evaluations.
     * By default, the current component.
     */
    resultContainer: ComponentOptions.buildSelectorOption(),
    /**
     * A query override to sent alongside the facet query.
     * By default, fetches all documents (@uri)
     */
    queryOverride: ComponentOptions.buildStringOption({
      defaultValue: '@uri'
    }),
    /**
     * The sort criteria to use for the facet query.
     * By default, uses the score.
     */
    sortCriteria: ComponentOptions.buildCustomOption<ITemplatedFacetValidSortCriteria>(value => value as ITemplatedFacetValidSortCriteria, {
      defaultValue: 'score'
    }),
    /**
     * The maximum number of values to return.
     * By default, 5.
     */
    maximumNumberOfValues: ComponentOptions.buildNumberOption({
      defaultValue: 5
    }),
    /**
     * Whether to update the values on a new query.
     */
    updateOnNewQuery: ComponentOptions.buildBooleanOption({
      defaultValue: false
    })
  };

  private template: (...data: any[]) => string;

  private shownElements: HTMLElement[];
  private lastGroupByRequestId: number;

  /**
   * Creates a new Tab. Binds on buildingQuery event as well as an event on click of the element.
   * @param element The HTMLElement on which to instantiate the component. Normally a `div`.
   * @param options The options for the Tab component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: ITemplatedFacetOptions, bindings: IComponentBindings) {
    super(element, TemplatedFacet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, TemplatedFacet, options);
    Assert.exists(this.options.field);

    const script = $$(this.element).find('script');
    Assert.check(!!script, 'You must define a "script" tag to render each of your field value.');
    script.style.display = 'none';

    this.template = _.template(script.innerHTML.trim());
    this.shownElements = [];

    if (!this.options.resultContainer) {
      this.options.resultContainer = this.element;
    }

    if (this.options.updateOnNewQuery) {
      this.bindEventsForEachQuery();
    } else {
      this.bindEventsForOneTimeTrigger();
    }

    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, args => this.onAfterComponentsInitialization(args));
  }

  private bindEventsForEachQuery() {
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => {
      this.lastGroupByRequestId = args.queryBuilder.groupByRequests.length;
      const groupByRequest = this.getGroupByRequest();
      if (this.options.queryOverride === '@uri') {
        groupByRequest.queryOverride = args.queryBuilder.expression.build();
      }
      groupByRequest.advancedQueryOverride = args.queryBuilder.advancedExpression.build();
      args.queryBuilder.groupByRequests.push(groupByRequest);
    });
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => {
      this.handleFieldValues(args.results.groupByResults[this.lastGroupByRequestId].values);
    });
  }

  private async bindEventsForOneTimeTrigger() {
    if (this.searchInterface.options.autoTriggerQuery) {
      // If the first query is executed on load, we can hook our request to it.
      this.bindGroupByRequestOnTheNextQuery();
    } else {
      // If no query is triggered, fetch the fields directly.
      this.executeFieldUpdateUsingEndpoint();
    }
  }

  private async bindGroupByRequestOnTheNextQuery() {
    this.bind.oneRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => {
      this.lastGroupByRequestId = args.queryBuilder.groupByRequests.length;
      args.queryBuilder.groupByRequests.push(this.getGroupByRequest());
    });
    this.bind.oneRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => {
      this.handleFieldValues(args.results.groupByResults[this.lastGroupByRequestId].values);
    });
  }

  private async onAfterComponentsInitialization(args: any) {
    // Defer was introduced in later versions, do not break if the version does not support it yet.
    if (!!args && !!args.defer) {
      // This ensure that the first values are executed so that the state can be read by those dynamic components.
      args.defer.push(async () => await this.executeFieldUpdateUsingEndpoint());
    }
  }

  private async executeFieldUpdateUsingEndpoint() {
    const values = await this.searchInterface.queryController.getEndpoint().listFieldValues({
      field: this.options.field.toString(),
      queryOverride: this.options.queryOverride,
      maximumNumberOfValues: this.options.maximumNumberOfValues
    });
    this.handleFieldValues(values);
  }

  private getGroupByRequest(): IGroupByRequest {
    return {
      field: this.options.field.toString(),
      queryOverride: this.options.queryOverride,
      maximumNumberOfValues: this.options.maximumNumberOfValues,
      sortCriteria: this.options.sortCriteria
    };
  }

  private handleFieldValues(values: IIndexFieldValue[]): void {
    this.shownElements.forEach(shownElement => this.options.resultContainer.removeChild(shownElement));
    this.shownElements = values
      .map((value: IIndexFieldValue) => this.generateTemplateFromFieldValue(value))
      .map(element => {
        this.options.resultContainer.appendChild(element);
        return element;
      });
    this.element.classList.add('initialized');
  }

  private generateTemplateFromFieldValue(value: IIndexFieldValue): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = this.template({
      field: value,
      originalField: this.options.field
    });
    Initialization.automaticallyCreateComponentsInside(element, {
      bindings: this.getBindings(),
      options: {}
    });
    return element.firstElementChild as HTMLElement;
  }
}

Initialization.registerAutoCreateComponent(TemplatedFacet);
