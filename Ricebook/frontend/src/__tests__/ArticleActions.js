import { mount, shallow } from 'enzyme';
import Main from '../components/Main';
import { requestUsers } from '../util';

describe('Article actions', () => {
    let wrapper;
    let instance;
    beforeAll(async () => {
        localStorage.clear();
        await requestUsers();
        localStorage["user"] = JSON.stringify(JSON.parse(localStorage["users"])[0]);
        wrapper = mount(<Main />);
        instance = wrapper.instance();
        await instance.componentDidMount();
    });

    it('Check articles fetch depends on login user', () => {
        expect(wrapper.state('articles').length).toEqual(40);
        expect(wrapper.state('user').follow.length).toEqual(3);
        let set = new Set(wrapper.state('user').follow);
        set.add(wrapper.state('user').id);
        for (let i = 0; i < wrapper.state('articles').length; i++) {
            expect(set.has(wrapper.state('articles')[i].userId)).toBeTruthy();
        }
    });

    it('Check articles search', () => {
        let searchBar = wrapper.find({ "data-test-id": "main-search-articles-input" }).find("input");
        let searchButton = wrapper.find({ "data-test-id": "main-search-articles-button" }).find("button");
        searchBar.simulate('change', { target: { value: 'molestiae' } });
        searchButton.simulate('click');
        let originalArticles = wrapper.state('articles');
        let filterArticles = wrapper.state('showArticlesIndex');
        expect(originalArticles.length).toEqual(40);
        expect(filterArticles.length).toEqual(13);
        for (let i = 0; i < filterArticles.length; i++) {
            expect(
                originalArticles[filterArticles[i]].body.indexOf('molestiae') == -1
                && originalArticles[filterArticles[i]].authorName.indexOf('molestiae') == -1
            ).toBeFalsy();
        }
    });

    
    it('Check articles for new follower', (done) => {
        expect(wrapper.state('articles').length).toEqual(40);

        let followSearch = wrapper.find({ "data-test-id": "main-follow-input" }).find("input");
        let followButton = wrapper.find({ "data-test-id": "main-follow-button" }).find("button");
        followSearch.simulate('change', { target: { value: 'Delphine' } });
        followButton.simulate('click');

        setTimeout(() => {
            expect(wrapper.state('articles').length).toEqual(50);
            done();
        }, 2000);
    });

    it('Check articles after removing a follower', (done) => {
        expect(wrapper.state('articles').length).toEqual(50);

        instance.setFollowing("Delete", 3);

        setTimeout(() => {
            expect(wrapper.state('articles').length).toEqual(40);
            done();
        }, 2000);
    });

})

