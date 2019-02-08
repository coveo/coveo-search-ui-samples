import { ShowMore, IShowMoreOptions } from '../src/ShowMore';
import { Mock, Fake, Simulate } from 'coveo-search-ui-tests';
import { $$, InitializationEvents, QueryEvents, IBuildingQueryEventArgs } from 'coveo-search-ui';

describe('ShowMore', () => {
    let showMore: Mock.IBasicComponentSetup<ShowMore>;

    beforeEach(() => {
        showMore = Mock.basicComponentSetup<ShowMore>(ShowMore);
    });

    afterEach(() => {
        showMore = null;
    });

    it('should do something', () => {
        expect(true).toBe(true);
    });
});
