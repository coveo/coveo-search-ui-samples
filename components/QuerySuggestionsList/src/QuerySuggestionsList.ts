import {
    QueryEvents,
    IComponentBindings,
    ComponentOptions,
    Component,
    Initialization,
    IQuerySuggestRequest,
    Utils,
    ComponentOptionsModel,
    Cookie,
    IBuildingQueryEventArgs,
    IQuerySuggestCompletion,
    KeyboardUtils,
    KEYBOARD
} from 'coveo-search-ui';
import './QuerySuggestionsList.scss';

export interface IQuerySuggestionsListOptions {
    numberOfSuggestions: number;
}

export class QuerySuggestionsList extends Component {
    static ID = 'QuerySuggestionsList';

    static options: IQuerySuggestionsListOptions = {
        numberOfSuggestions: ComponentOptions.buildNumberOption({
            defaultValue: 5
        })
    };

    constructor(public element: HTMLElement, public options: IQuerySuggestionsListOptions, public bindings: IComponentBindings) {
        super(element, QuerySuggestionsList.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, QuerySuggestionsList, options);

        this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IBuildingQueryEventArgs) => {
            const text = args.queryBuilder.expression.build();
            this.computeSuggestions(text);
        });
    }

    private async computeSuggestions(text: string): Promise<void> {
        const results = await this.queryController.getEndpoint().getQuerySuggest(this.getPayload(text));

        const container = document.createElement('div');
        container.classList.add('suggestions-container');
        results.completions
            .filter(completion => completion.expression !== text)
            .map(completion => this.renderCompletion(completion))
            .forEach(element => container.appendChild(element));

        this.element.innerHTML = '';
        this.element.appendChild(container);
    }

    private renderCompletion(completion: IQuerySuggestCompletion): HTMLElement {
        const element = document.createElement('div');

        const applyCompletion = () =>  this.setExpressionInState(completion.expression);

        element.classList.add('suggestion');
        element.innerHTML = completion.expression;
        element.addEventListener('click', applyCompletion);
        element.addEventListener('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, applyCompletion));
        element.setAttribute('role', 'button');
        element.setAttribute('aria-label', completion.expression);
        element.setAttribute('tabindex', '0');

        return element;
    }

    private setExpressionInState(expression: string) {
        this.queryStateModel.set('q', expression);
        this.queryController.executeQuery();
    }

    private getPayload(text: string): IQuerySuggestRequest {
        return {
            q: text,
            locale: this.locale,
            searchHub: this.searchHub,
            pipeline: this.pipeline,
            enableWordCompletion: this.enableWordCompletion,
            context: this.context,
            count: this.count,
            tab: this.tab,
            referrer: document.referrer,
            actionsHistory: this.actionsHistory,
            timezone: this.timezone,
            visitorId: this.visitorId,
            isGuestUser: this.isGuestUser
        } as IQuerySuggestRequest;
    }

    private get tab() {
        const tab = this.queryStateModel.get('t') as string;

        if (Utils.isNonEmptyString(tab)) {
            return tab;
        }

        return undefined;
    }

    private get locale() {
        return String['locale'];
    }

    private get searchHub() {
        return this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchHub);
    }

    private get pipeline() {
        return this.searchInterface.options.pipeline;
    }

    private get enableWordCompletion() {
        return false; //this.omnibox.options.enableSearchAsYouType;
    }

    private get context() {
        return this.searchInterface.getQueryContext();
    }

    private get count() {
        return this.options.numberOfSuggestions;
    }

    private get actionsHistory() {
        const historyFromStore = this.queryController.historyStore.getHistory();
        return historyFromStore || [];
    }

    private get timezone() {
        return this.searchInterface.options.timezone;
    }

    private get visitorId() {
        return Cookie.get('visitorId');
    }

    private get isGuestUser() {
        return this.queryController.getEndpoint().options.isGuestUser;
    }
}

Initialization.registerAutoCreateComponent(QuerySuggestionsList);