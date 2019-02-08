import {
    l,
    logCustomEvent,
    state,
    $$,
    LocalStorageUtils,
    IQuerySuccessEventArgs,
    QueryEvents,
    IComponentBindings,
    ComponentOptions,
    Component,
    Initialization
} from 'coveo-search-ui';

import { xButtonSvg } from "./XButtonSvg";
import "./SearchHistory.scss";

export interface ISearchHistoryOptions {
    caption: string;
    numberOfQueries: number;
}

export class SearchHistory extends Component {
    static ID = 'SearchHistory';

    static options: ISearchHistoryOptions = {
        caption: ComponentOptions.buildStringOption(),
        numberOfQueries: ComponentOptions.buildNumberOption({ defaultValue: 10 })
    };

    private queriesList: string[] = [];
    private queriesListHTMLElement: HTMLElement | null = null;
    private localStorage: any;
    private refreshList: boolean = true;

    constructor(public element: HTMLElement, public options: ISearchHistoryOptions, public bindings: IComponentBindings) {
        super(element, SearchHistory.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, SearchHistory, options);
        this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));

        this.hide();
        this.initLocalStorage();
        this.element.appendChild(this.build());
    }

    private initLocalStorage() {
        this.localStorage = new LocalStorageUtils('SearchHistory');
        this.queriesList = JSON.parse(this.localStorage.load()) || [];
    }

    private hide() {
        $$(this.element).addClass('hidden');
    }

    private show() {
        $$(this.element).removeClass('hidden');
    }

    private handleQuerySuccess(args: IQuerySuccessEventArgs) {
        const query = args.queryBuilder.expression.build();
        if (this.refreshList && args.results.results.length > 0) {
            this.show();
            this.addToQueriesList(query);
        } else {
            this.hide();
        }

        $$(this.element).toggleClass('hidden', this.queriesList.length === 0);
        this.refreshList = true;
    }

    private handleHistoryClick(expression: string) {
        this.refreshList = false;
        state(this.root, 'q', expression);
        this.queryController.deferExecuteQuery({
            beforeExecuteQuery: () => {
                logCustomEvent(
                    this.root,
                    { name: 'searchFromHistory', type: 'customEventType' },
                    {
                        queryHistory: expression
                    }
                );
            }
        });
    }

    private addToQueriesList(query: string) {
        this.queriesList = _.chain(this.queriesList)
            .push(query)
            .compact()
            .uniq()
            .last(this.options.numberOfQueries + 1)
            .value();
        this.saveAndUpdateQueriesList();
    }

    private saveAndUpdateQueriesList() {
        this.localStorage.save(JSON.stringify(this.queriesList));
        this.buildPreviousQueries(this.queriesList);
    }

    public build(): HTMLElement {
        const element = $$('div');

        this.queriesListHTMLElement = $$('ol', { class: 'queries-history-list' }).el;

        element.append(this.buildPanelHeading());
        element.append(this.queriesListHTMLElement);

        return element.el;
    }

    public buildPanelHeading(): HTMLElement {
        const panelHeading = $$('div', { className: 'panel-heading' });
        const caption = $$('span', { className: 'caption-for-queries-history' }, this.options.caption || l('SearchHistory'));
        const xButton = $$('div', { className: 'search-history-clear-button' }, xButtonSvg);
        xButton.on("click", () => this.clearQueries());
        caption.append(xButton.el);

        panelHeading.append($$('i', { className: 'fas fa-history' }).el);
        panelHeading.append(caption.el);

        return panelHeading.el;
    }

    public buildPreviousQueries(list: any[]) {
        if (this.queriesListHTMLElement) {
            this.queriesListHTMLElement.innerHTML = '';
            _.each(this.queriesList, expression => {
                // if (expression !== state(this.root, 'q')) {
                const listItemCaption = $$('div', { className: 'queries-history-item-caption' }, expression);
                const listItem = $$('li');
                listItem.append(listItemCaption.el);

                listItem.on('click', () => this.handleHistoryClick(expression));

                $$(this.queriesListHTMLElement as HTMLElement).prepend(listItem.el);
                // }
            });
        } else {
            this.logger.error('queriesListHTMLElement is null');
        }
    }

    public clearQueries() {
        this.queriesList = [];
        this.saveAndUpdateQueriesList();
        this.hide();
    }
}

Initialization.registerAutoCreateComponent(SearchHistory);